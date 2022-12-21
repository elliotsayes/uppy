let _Symbol$for;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

/**
 * This plugin is currently a A Big Hack™! The core reason for that is how this plugin
 * interacts with Uppy's current pipeline design. The pipeline can handle files in steps,
 * including preprocessing, uploading, and postprocessing steps. This plugin initially
 * was designed to do its work in a preprocessing step, and let XHRUpload deal with the
 * actual file upload as an uploading step. However, Uppy runs steps on all files at once,
 * sequentially: first, all files go through a preprocessing step, then, once they are all
 * done, they go through the uploading step.
 *
 * For S3, this causes severely broken behaviour when users upload many files. The
 * preprocessing step will request S3 upload URLs that are valid for a short time only,
 * but it has to do this for _all_ files, which can take a long time if there are hundreds
 * or even thousands of files. By the time the uploader step starts, the first URLs may
 * already have expired. If not, the uploading might take such a long time that later URLs
 * will expire before some files can be uploaded.
 *
 * The long-term solution to this problem is to change the upload pipeline so that files
 * can be sent to the next step individually. That requires a breaking change, so it is
 * planned for some future Uppy version.
 *
 * In the mean time, this plugin is stuck with a hackier approach: the necessary parts
 * of the XHRUpload implementation were copied into this plugin, as the MiniXHRUpload
 * class, and this plugin calls into it immediately once it receives an upload URL.
 * This isn't as nicely modular as we'd like and requires us to maintain two copies of
 * the XHRUpload code, but at least it's not horrifically broken :)
 */
import BasePlugin from '@uppy/core/lib/BasePlugin.js';
import { RateLimitedQueue, internalRateLimitedQueue } from '@uppy/utils/lib/RateLimitedQueue';
import { RequestClient } from '@uppy/companion-client';
const packageJson = {
  "version": "3.0.4"
};
import MiniXHRUpload from './MiniXHRUpload.js';
import isXml from './isXml.js';
import locale from './locale.js';

function resolveUrl(origin, link) {
  // DigitalOcean doesn’t return the protocol from Location
  // without it, the `new URL` constructor will fail
  if (!origin && !link.startsWith('https://') && !link.startsWith('http://')) {
    link = `https://${link}`; // eslint-disable-line no-param-reassign
  }

  return new URL(link, origin || undefined).toString();
}
/**
 * Get the contents of a named tag in an XML source string.
 *
 * @param {string} source - The XML source string.
 * @param {string} tagName - The name of the tag.
 * @returns {string} The contents of the tag, or the empty string if the tag does not exist.
 */


function getXmlValue(source, tagName) {
  const start = source.indexOf(`<${tagName}>`);
  const end = source.indexOf(`</${tagName}>`, start);
  return start !== -1 && end !== -1 ? source.slice(start + tagName.length + 2, end) : '';
}

function assertServerError(res) {
  if (res && res.error) {
    const error = new Error(res.message);
    Object.assign(error, res.error);
    throw error;
  }

  return res;
}

function validateParameters(file, params) {
  const valid = params != null && typeof params.url === 'string' && (typeof params.fields === 'object' || params.fields == null);

  if (!valid) {
    const err = new TypeError(`AwsS3: got incorrect result from 'getUploadParameters()' for file '${file.name}', expected an object '{ url, method, fields, headers }' but got '${JSON.stringify(params)}' instead.\nSee https://uppy.io/docs/aws-s3/#getUploadParameters-file for more on the expected format.`);
    throw err;
  }

  const methodIsValid = params.method == null || /^p(u|os)t$/i.test(params.method);

  if (!methodIsValid) {
    const err = new TypeError(`AwsS3: got incorrect method from 'getUploadParameters()' for file '${file.name}', expected  'put' or 'post' but got '${params.method}' instead.\nSee https://uppy.io/docs/aws-s3/#getUploadParameters-file for more on the expected format.`);
    throw err;
  }
} // Get the error data from a failed XMLHttpRequest instance.
// `content` is the S3 response as a string.
// `xhr` is the XMLHttpRequest instance.


function defaultGetResponseError(content, xhr) {
  // If no response, we don't have a specific error message, use the default.
  if (!isXml(content, xhr)) {
    return undefined;
  }

  const error = getXmlValue(content, 'Message');
  return new Error(error);
} // warning deduplication flag: see `getResponseData()` XHRUpload option definition


let warnedSuccessActionStatus = false;

var _client = /*#__PURE__*/_classPrivateFieldLooseKey("client");

var _requests = /*#__PURE__*/_classPrivateFieldLooseKey("requests");

var _uploader = /*#__PURE__*/_classPrivateFieldLooseKey("uploader");

var _handleUpload = /*#__PURE__*/_classPrivateFieldLooseKey("handleUpload");

var _setCompanionHeaders = /*#__PURE__*/_classPrivateFieldLooseKey("setCompanionHeaders");

_Symbol$for = Symbol.for('uppy test: getClient');
export default class AwsS3 extends BasePlugin {
  constructor(uppy, opts) {
    super(uppy, opts);
    Object.defineProperty(this, _client, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _requests, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _uploader, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _handleUpload, {
      writable: true,
      value: fileIDs => {
        /**
         * keep track of `getUploadParameters()` responses
         * so we can cancel the calls individually using just a file ID
         *
         * @type {Record<string, import('@uppy/utils/lib/RateLimitedQueue').AbortablePromise<unknown>>}
         */
        const paramsPromises = Object.create(null);

        function onremove(file) {
          var _paramsPromises$id;

          const {
            id
          } = file;
          (_paramsPromises$id = paramsPromises[id]) == null ? void 0 : _paramsPromises$id.abort();
        }

        this.uppy.on('file-removed', onremove);
        fileIDs.forEach(id => {
          const file = this.uppy.getFile(id);
          this.uppy.emit('upload-started', file);
        });

        const getUploadParameters = _classPrivateFieldLooseBase(this, _requests)[_requests].wrapPromiseFunction(file => {
          return this.opts.getUploadParameters(file);
        });

        const numberOfFiles = fileIDs.length;
        return Promise.allSettled(fileIDs.map((id, index) => {
          paramsPromises[id] = getUploadParameters(this.uppy.getFile(id));
          return paramsPromises[id].then(params => {
            delete paramsPromises[id];
            const file = this.uppy.getFile(id);
            validateParameters(file, params);
            const {
              method = 'post',
              url,
              fields,
              headers
            } = params;
            const xhrOpts = {
              method,
              formData: method.toLowerCase() === 'post',
              endpoint: url,
              allowedMetaFields: fields ? Object.keys(fields) : []
            };

            if (headers) {
              xhrOpts.headers = headers;
            }

            this.uppy.setFileState(file.id, {
              meta: { ...file.meta,
                ...fields
              },
              xhrUpload: xhrOpts
            });
            return _classPrivateFieldLooseBase(this, _uploader)[_uploader].uploadFile(file.id, index, numberOfFiles);
          }).catch(error => {
            delete paramsPromises[id];
            const file = this.uppy.getFile(id);
            this.uppy.emit('upload-error', file, error);
            return Promise.reject(error);
          });
        })).finally(() => {
          // cleanup.
          this.uppy.off('file-removed', onremove);
        });
      }
    });
    Object.defineProperty(this, _setCompanionHeaders, {
      writable: true,
      value: () => {
        _classPrivateFieldLooseBase(this, _client)[_client].setCompanionHeaders(this.opts.companionHeaders);

        return Promise.resolve();
      }
    });
    this.type = 'uploader';
    this.id = this.opts.id || 'AwsS3';
    this.title = 'AWS S3';
    this.defaultLocale = locale;
    const defaultOptions = {
      timeout: 30 * 1000,
      limit: 0,
      allowedMetaFields: [],
      // have to opt in
      getUploadParameters: this.getUploadParameters.bind(this),
      companionHeaders: {}
    };
    this.opts = { ...defaultOptions,
      ...opts
    };

    if ((opts == null ? void 0 : opts.allowedMetaFields) === undefined && 'metaFields' in this.opts) {
      throw new Error('The `metaFields` option has been renamed to `allowedMetaFields`.');
    } // TODO: remove i18n once we can depend on XHRUpload instead of MiniXHRUpload


    this.i18nInit();
    _classPrivateFieldLooseBase(this, _client)[_client] = new RequestClient(uppy, opts);
    _classPrivateFieldLooseBase(this, _requests)[_requests] = new RateLimitedQueue(this.opts.limit);
  }

  [_Symbol$for]() {
    return _classPrivateFieldLooseBase(this, _client)[_client];
  } // TODO: remove getter and setter for #client on the next major release


  get client() {
    return _classPrivateFieldLooseBase(this, _client)[_client];
  }

  set client(client) {
    _classPrivateFieldLooseBase(this, _client)[_client] = client;
  }

  getUploadParameters(file) {
    if (!this.opts.companionUrl) {
      throw new Error('Expected a `companionUrl` option containing a Companion address.');
    }

    const filename = file.meta.name;
    const {
      type
    } = file.meta;
    const metadata = Object.fromEntries(this.opts.allowedMetaFields.filter(key => file.meta[key] != null).map(key => [`metadata[${key}]`, file.meta[key].toString()]));
    const query = new URLSearchParams({
      filename,
      type,
      ...metadata
    });
    return _classPrivateFieldLooseBase(this, _client)[_client].get(`s3/params?${query}`).then(assertServerError);
  }

  install() {
    const {
      uppy
    } = this;
    uppy.addPreProcessor(_classPrivateFieldLooseBase(this, _setCompanionHeaders)[_setCompanionHeaders]);
    uppy.addUploader(_classPrivateFieldLooseBase(this, _handleUpload)[_handleUpload]); // Get the response data from a successful XMLHttpRequest instance.
    // `content` is the S3 response as a string.
    // `xhr` is the XMLHttpRequest instance.

    function defaultGetResponseData(content, xhr) {
      const opts = this; // If no response, we've hopefully done a PUT request to the file
      // in the bucket on its full URL.

      if (!isXml(content, xhr)) {
        if (opts.method.toUpperCase() === 'POST') {
          if (!warnedSuccessActionStatus) {
            uppy.log('[AwsS3] No response data found, make sure to set the success_action_status AWS SDK option to 201. See https://uppy.io/docs/aws-s3/#POST-Uploads', 'warning');
            warnedSuccessActionStatus = true;
          } // The responseURL won't contain the object key. Give up.


          return {
            location: null
          };
        } // responseURL is not available in older browsers.


        if (!xhr.responseURL) {
          return {
            location: null
          };
        } // Trim the query string because it's going to be a bunch of presign
        // parameters for a PUT request—doing a GET request with those will
        // always result in an error


        return {
          location: xhr.responseURL.replace(/\?.*$/, '')
        };
      }

      return {
        // Some S3 alternatives do not reply with an absolute URL.
        // Eg DigitalOcean Spaces uses /$bucketName/xyz
        location: resolveUrl(xhr.responseURL, getXmlValue(content, 'Location')),
        bucket: getXmlValue(content, 'Bucket'),
        key: getXmlValue(content, 'Key'),
        etag: getXmlValue(content, 'ETag')
      };
    }

    const xhrOptions = {
      fieldName: 'file',
      responseUrlFieldName: 'location',
      timeout: this.opts.timeout,
      // Share the rate limiting queue with XHRUpload.
      [internalRateLimitedQueue]: _classPrivateFieldLooseBase(this, _requests)[_requests],
      responseType: 'text',
      getResponseData: this.opts.getResponseData || defaultGetResponseData,
      getResponseError: defaultGetResponseError
    }; // TODO: remove i18n once we can depend on XHRUpload instead of MiniXHRUpload

    xhrOptions.i18n = this.i18n; // Revert to `uppy.use(XHRUpload)` once the big comment block at the top of
    // this file is solved

    _classPrivateFieldLooseBase(this, _uploader)[_uploader] = new MiniXHRUpload(uppy, xhrOptions);
  }

  uninstall() {
    this.uppy.removePreProcessor(_classPrivateFieldLooseBase(this, _setCompanionHeaders)[_setCompanionHeaders]);
    this.uppy.removeUploader(_classPrivateFieldLooseBase(this, _handleUpload)[_handleUpload]);
  }

}
AwsS3.VERSION = packageJson.version;