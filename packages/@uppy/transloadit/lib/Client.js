function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

import fetchWithNetworkError from '@uppy/utils/lib/fetchWithNetworkError';
const ASSEMBLIES_ENDPOINT = '/assemblies';
/**
 * A Barebones HTTP API client for Transloadit.
 */

var _headers = /*#__PURE__*/_classPrivateFieldLooseKey("headers");

var _fetchWithNetworkError = /*#__PURE__*/_classPrivateFieldLooseKey("fetchWithNetworkError");

var _fetchJSON = /*#__PURE__*/_classPrivateFieldLooseKey("fetchJSON");

var _reportError = /*#__PURE__*/_classPrivateFieldLooseKey("reportError");

export default class Client {
  constructor(_opts) {
    if (_opts === void 0) {
      _opts = {};
    }

    Object.defineProperty(this, _fetchJSON, {
      value: _fetchJSON2
    });
    Object.defineProperty(this, _headers, {
      writable: true,
      value: {}
    });
    Object.defineProperty(this, _fetchWithNetworkError, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _reportError, {
      writable: true,
      value: (err, params) => {
        if (this.opts.errorReporting === false) {
          throw err;
        }

        const opts = {
          type: params.type
        };

        if (params.assembly) {
          opts.assembly = params.assembly.assembly_id;
          opts.instance = params.assembly.instance;
        }

        if (params.url) {
          opts.endpoint = params.url;
        }

        this.submitError(err, opts).catch(() => {// not much we can do then is there
        });
        throw err;
      }
    });
    this.opts = _opts;

    if (this.opts.client != null) {
      _classPrivateFieldLooseBase(this, _headers)[_headers]['Transloadit-Client'] = this.opts.client;
    }

    _classPrivateFieldLooseBase(this, _fetchWithNetworkError)[_fetchWithNetworkError] = this.opts.rateLimitedQueue.wrapPromiseFunction(fetchWithNetworkError);
  }
  /**
   * @param  {[RequestInfo | URL, RequestInit]} args
   * @returns {Promise<any>}
   */


  /**
   * Create a new assembly.
   *
   * @param {object} options
   * @param {string|object} options.params
   * @param {object} options.fields
   * @param {string} options.signature
   * @param {number} options.expectedFiles
   */
  createAssembly(_ref) {
    let {
      params,
      fields,
      signature,
      expectedFiles
    } = _ref;
    const data = new FormData();
    data.append('params', typeof params === 'string' ? params : JSON.stringify(params));

    if (signature) {
      data.append('signature', signature);
    }

    Object.keys(fields).forEach(key => {
      data.append(key, fields[key]);
    });
    data.append('num_expected_upload_files', expectedFiles);
    const url = new URL(ASSEMBLIES_ENDPOINT, `${this.opts.service}`).href;
    return _classPrivateFieldLooseBase(this, _fetchJSON)[_fetchJSON](url, {
      method: 'post',
      headers: _classPrivateFieldLooseBase(this, _headers)[_headers],
      body: data
    }).catch(err => _classPrivateFieldLooseBase(this, _reportError)[_reportError](err, {
      url,
      type: 'API_ERROR'
    }));
  }
  /**
   * Reserve resources for a file in an Assembly. Then addFile can be used later.
   *
   * @param {object} assembly
   * @param {UppyFile} file
   */


  reserveFile(assembly, file) {
    const size = encodeURIComponent(file.size);
    const url = `${assembly.assembly_ssl_url}/reserve_file?size=${size}`;
    return _classPrivateFieldLooseBase(this, _fetchJSON)[_fetchJSON](url, {
      method: 'post',
      headers: _classPrivateFieldLooseBase(this, _headers)[_headers]
    }).catch(err => _classPrivateFieldLooseBase(this, _reportError)[_reportError](err, {
      assembly,
      file,
      url,
      type: 'API_ERROR'
    }));
  }
  /**
   * Import a remote file to an Assembly.
   *
   * @param {object} assembly
   * @param {UppyFile} file
   */


  addFile(assembly, file) {
    if (!file.uploadURL) {
      return Promise.reject(new Error('File does not have an `uploadURL`.'));
    }

    const size = encodeURIComponent(file.size);
    const uploadUrl = encodeURIComponent(file.uploadURL);
    const filename = encodeURIComponent(file.name);
    const fieldname = 'file';
    const qs = `size=${size}&filename=${filename}&fieldname=${fieldname}&s3Url=${uploadUrl}`;
    const url = `${assembly.assembly_ssl_url}/add_file?${qs}`;
    return _classPrivateFieldLooseBase(this, _fetchJSON)[_fetchJSON](url, {
      method: 'post',
      headers: _classPrivateFieldLooseBase(this, _headers)[_headers]
    }).catch(err => _classPrivateFieldLooseBase(this, _reportError)[_reportError](err, {
      assembly,
      file,
      url,
      type: 'API_ERROR'
    }));
  }
  /**
   * Update the number of expected files in an already created assembly.
   *
   * @param {object} assembly
   * @param {number} num_expected_upload_files
   */


  updateNumberOfFilesInAssembly(assembly, num_expected_upload_files) {
    const url = new URL(assembly.assembly_ssl_url);
    url.pathname = '/update_assemblies';
    const body = JSON.stringify({
      assembly_updates: [{
        assembly_id: assembly.assembly_id,
        num_expected_upload_files
      }]
    });
    return _classPrivateFieldLooseBase(this, _fetchJSON)[_fetchJSON](url, {
      method: 'post',
      headers: _classPrivateFieldLooseBase(this, _headers)[_headers],
      body
    }).catch(err => _classPrivateFieldLooseBase(this, _reportError)[_reportError](err, {
      url,
      type: 'API_ERROR'
    }));
  }
  /**
   * Cancel a running Assembly.
   *
   * @param {object} assembly
   */


  cancelAssembly(assembly) {
    const url = assembly.assembly_ssl_url;
    return _classPrivateFieldLooseBase(this, _fetchJSON)[_fetchJSON](url, {
      method: 'delete',
      headers: _classPrivateFieldLooseBase(this, _headers)[_headers]
    }).catch(err => _classPrivateFieldLooseBase(this, _reportError)[_reportError](err, {
      url,
      type: 'API_ERROR'
    }));
  }
  /**
   * Get the current status for an assembly.
   *
   * @param {string} url The status endpoint of the assembly.
   */


  getAssemblyStatus(url) {
    return _classPrivateFieldLooseBase(this, _fetchJSON)[_fetchJSON](url, {
      headers: _classPrivateFieldLooseBase(this, _headers)[_headers]
    }).catch(err => _classPrivateFieldLooseBase(this, _reportError)[_reportError](err, {
      url,
      type: 'STATUS_ERROR'
    }));
  }

  submitError(err, _temp) {
    let {
      endpoint,
      instance,
      assembly
    } = _temp === void 0 ? {} : _temp;
    const message = err.details ? `${err.message} (${err.details})` : err.message;
    return _classPrivateFieldLooseBase(this, _fetchJSON)[_fetchJSON]('https://transloaditstatus.com/client_error', {
      method: 'post',
      body: JSON.stringify({
        endpoint,
        instance,
        assembly_id: assembly,
        agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        client: this.opts.client,
        error: message
      })
    });
  }

}

function _fetchJSON2() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _classPrivateFieldLooseBase(this, _fetchWithNetworkError)[_fetchWithNetworkError](...args).then(response => {
    if (response.status === 429) {
      this.opts.rateLimitedQueue.rateLimit(2000);
      return _classPrivateFieldLooseBase(this, _fetchJSON)[_fetchJSON](...args);
    }

    if (!response.ok) {
      const serverError = new Error(response.statusText);
      serverError.statusCode = response.status;
      if (!`${args[0]}`.endsWith(ASSEMBLIES_ENDPOINT)) return Promise.reject(serverError); // Failed assembly requests should return a more detailed error in JSON.

      return response.json().then(assembly => {
        if (!assembly.error) throw serverError;
        const error = new Error(assembly.error);
        error.details = assembly.message;
        error.assembly = assembly;

        if (assembly.assembly_id) {
          error.details += ` Assembly ID: ${assembly.assembly_id}`;
        }

        throw error;
      }, err => {
        // eslint-disable-next-line no-param-reassign
        err.cause = serverError;
        throw err;
      });
    }

    return response.json();
  });
}