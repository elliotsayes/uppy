let _Symbol$for;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

import BasePlugin from '@uppy/core/lib/BasePlugin.js';
import { Socket, Provider, RequestClient } from '@uppy/companion-client';
import EventTracker from '@uppy/utils/lib/EventTracker';
import emitSocketProgress from '@uppy/utils/lib/emitSocketProgress';
import getSocketHost from '@uppy/utils/lib/getSocketHost';
import { RateLimitedQueue } from '@uppy/utils/lib/RateLimitedQueue';
import { createAbortError } from '@uppy/utils/lib/AbortController';
const packageJson = {
  "version": "3.1.1"
};
import MultipartUploader from './MultipartUploader.js';

function assertServerError(res) {
  if (res && res.error) {
    const error = new Error(res.message);
    Object.assign(error, res.error);
    throw error;
  }

  return res;
}

function throwIfAborted(signal) {
  if (signal != null && signal.aborted) {
    throw createAbortError('The operation was aborted', {
      cause: signal.reason
    });
  }
}

var _abortMultipartUpload = /*#__PURE__*/_classPrivateFieldLooseKey("abortMultipartUpload");

var _cache = /*#__PURE__*/_classPrivateFieldLooseKey("cache");

var _createMultipartUpload = /*#__PURE__*/_classPrivateFieldLooseKey("createMultipartUpload");

var _fetchSignature = /*#__PURE__*/_classPrivateFieldLooseKey("fetchSignature");

var _listParts = /*#__PURE__*/_classPrivateFieldLooseKey("listParts");

var _previousRetryDelay = /*#__PURE__*/_classPrivateFieldLooseKey("previousRetryDelay");

var _requests = /*#__PURE__*/_classPrivateFieldLooseKey("requests");

var _retryDelayIterator = /*#__PURE__*/_classPrivateFieldLooseKey("retryDelayIterator");

var _sendCompletionRequest = /*#__PURE__*/_classPrivateFieldLooseKey("sendCompletionRequest");

var _setS3MultipartState = /*#__PURE__*/_classPrivateFieldLooseKey("setS3MultipartState");

var _uploadPartBytes = /*#__PURE__*/_classPrivateFieldLooseKey("uploadPartBytes");

var _shouldRetry = /*#__PURE__*/_classPrivateFieldLooseKey("shouldRetry");

class HTTPCommunicationQueue {
  constructor(_requests2, options, setS3MultipartState) {
    Object.defineProperty(this, _shouldRetry, {
      value: _shouldRetry2
    });
    Object.defineProperty(this, _abortMultipartUpload, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _cache, {
      writable: true,
      value: new WeakMap()
    });
    Object.defineProperty(this, _createMultipartUpload, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _fetchSignature, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _listParts, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _previousRetryDelay, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _requests, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _retryDelayIterator, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _sendCompletionRequest, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _setS3MultipartState, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _uploadPartBytes, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldLooseBase(this, _requests)[_requests] = _requests2;
    _classPrivateFieldLooseBase(this, _setS3MultipartState)[_setS3MultipartState] = setS3MultipartState;
    this.setOptions(options);
  }

  setOptions(options) {
    const requests = _classPrivateFieldLooseBase(this, _requests)[_requests];

    if ('abortMultipartUpload' in options) {
      _classPrivateFieldLooseBase(this, _abortMultipartUpload)[_abortMultipartUpload] = requests.wrapPromiseFunction(options.abortMultipartUpload);
    }

    if ('createMultipartUpload' in options) {
      _classPrivateFieldLooseBase(this, _createMultipartUpload)[_createMultipartUpload] = requests.wrapPromiseFunction(options.createMultipartUpload, {
        priority: -1
      });
    }

    if ('signPart' in options) {
      _classPrivateFieldLooseBase(this, _fetchSignature)[_fetchSignature] = requests.wrapPromiseFunction(options.signPart);
    }

    if ('listParts' in options) {
      _classPrivateFieldLooseBase(this, _listParts)[_listParts] = requests.wrapPromiseFunction(options.listParts);
    }

    if ('completeMultipartUpload' in options) {
      _classPrivateFieldLooseBase(this, _sendCompletionRequest)[_sendCompletionRequest] = requests.wrapPromiseFunction(options.completeMultipartUpload);
    }

    if ('retryDelays' in options) {
      var _options$retryDelays;

      _classPrivateFieldLooseBase(this, _retryDelayIterator)[_retryDelayIterator] = (_options$retryDelays = options.retryDelays) == null ? void 0 : _options$retryDelays.values();
    }

    if ('uploadPartBytes' in options) {
      _classPrivateFieldLooseBase(this, _uploadPartBytes)[_uploadPartBytes] = requests.wrapPromiseFunction(options.uploadPartBytes, {
        priority: Infinity
      });
    }
  }

  async getUploadId(file, signal) {
    const cachedResult = _classPrivateFieldLooseBase(this, _cache)[_cache].get(file.data);

    if (cachedResult != null) {
      return cachedResult;
    }

    const promise = _classPrivateFieldLooseBase(this, _createMultipartUpload)[_createMultipartUpload](file, signal);

    const abortPromise = () => {
      promise.abort(signal.reason);

      _classPrivateFieldLooseBase(this, _cache)[_cache].delete(file.data);
    };

    signal.addEventListener('abort', abortPromise, {
      once: true
    });

    _classPrivateFieldLooseBase(this, _cache)[_cache].set(file.data, promise);

    promise.then(async result => {
      signal.removeEventListener('abort', abortPromise);

      _classPrivateFieldLooseBase(this, _setS3MultipartState)[_setS3MultipartState](file, result);

      _classPrivateFieldLooseBase(this, _cache)[_cache].set(file.data, result);
    }, () => {
      signal.removeEventListener('abort', abortPromise);
    });
    return promise;
  }

  async abortFileUpload(file) {
    const result = _classPrivateFieldLooseBase(this, _cache)[_cache].get(file.data);

    if (result != null) {
      // If the createMultipartUpload request never was made, we don't
      // need to send the abortMultipartUpload request.
      await _classPrivateFieldLooseBase(this, _abortMultipartUpload)[_abortMultipartUpload](file, await result);
    }
  }

  async uploadFile(file, chunks, signal) {
    throwIfAborted(signal);
    const {
      uploadId,
      key
    } = await this.getUploadId(file, signal);
    throwIfAborted(signal);
    const parts = await Promise.all(chunks.map((chunk, i) => this.uploadChunk(file, i + 1, chunk, signal)));
    throwIfAborted(signal);
    return _classPrivateFieldLooseBase(this, _sendCompletionRequest)[_sendCompletionRequest](file, {
      key,
      uploadId,
      parts,
      signal
    }).abortOn(signal);
  }

  async resumeUploadFile(file, chunks, signal) {
    throwIfAborted(signal);
    const {
      uploadId,
      key
    } = await this.getUploadId(file, signal);
    throwIfAborted(signal);
    const alreadyUploadedParts = await _classPrivateFieldLooseBase(this, _listParts)[_listParts](file, {
      uploadId,
      key,
      signal
    }).abortOn(signal);
    throwIfAborted(signal);
    const parts = await Promise.all(chunks.map((chunk, i) => {
      const partNumber = i + 1;
      const alreadyUploadedInfo = alreadyUploadedParts.find(_ref => {
        let {
          PartNumber
        } = _ref;
        return PartNumber === partNumber;
      });
      return alreadyUploadedInfo == null ? this.uploadChunk(file, partNumber, chunk, signal) : {
        PartNumber: partNumber,
        ETag: alreadyUploadedInfo.ETag
      };
    }));
    throwIfAborted(signal);
    return _classPrivateFieldLooseBase(this, _sendCompletionRequest)[_sendCompletionRequest](file, {
      key,
      uploadId,
      parts,
      signal
    }).abortOn(signal);
  }

  async uploadChunk(file, partNumber, body, signal) {
    throwIfAborted(signal);
    const {
      uploadId,
      key
    } = await this.getUploadId(file, signal);
    throwIfAborted(signal);

    for (;;) {
      const signature = await _classPrivateFieldLooseBase(this, _fetchSignature)[_fetchSignature](file, {
        uploadId,
        key,
        partNumber,
        body,
        signal
      }).abortOn(signal);
      throwIfAborted(signal);

      try {
        return {
          PartNumber: partNumber,
          ...(await _classPrivateFieldLooseBase(this, _uploadPartBytes)[_uploadPartBytes](signature, body, signal).abortOn(signal))
        };
      } catch (err) {
        if (!(await _classPrivateFieldLooseBase(this, _shouldRetry)[_shouldRetry](err))) throw err;
      }
    }
  }

}

async function _shouldRetry2(err) {
  var _err$source;

  const requests = _classPrivateFieldLooseBase(this, _requests)[_requests];

  const status = err == null ? void 0 : (_err$source = err.source) == null ? void 0 : _err$source.status; // TODO: this retry logic is taken out of Tus. We should have a centralized place for retrying,
  // perhaps the rate limited queue, and dedupe all plugins with that.

  if (status == null) {
    return false;
  }

  if (status === 403 && err.message === 'Request has expired') {
    if (!requests.isPaused) {
      // We don't want to exhaust the retryDelayIterator as long as there are
      // more than one request in parallel, to give slower connection a chance
      // to catch up with the expiry set in Companion.
      if (requests.limit === 1 || _classPrivateFieldLooseBase(this, _previousRetryDelay)[_previousRetryDelay] == null) {
        var _classPrivateFieldLoo;

        const next = (_classPrivateFieldLoo = _classPrivateFieldLooseBase(this, _retryDelayIterator)[_retryDelayIterator]) == null ? void 0 : _classPrivateFieldLoo.next();

        if (next == null || next.done) {
          return false;
        } // If there are more than 1 request done in parallel, the RLQ limit is
        // decreased and the failed request is requeued after waiting for a bit.
        // If there is only one request in parallel, the limit can't be
        // decreased, so we iterate over `retryDelayIterator` as we do for
        // other failures.
        // `#previousRetryDelay` caches the value so we can re-use it next time.


        _classPrivateFieldLooseBase(this, _previousRetryDelay)[_previousRetryDelay] = next.value;
      } // No need to stop the other requests, we just want to lower the limit.


      requests.rateLimit(0);
      await new Promise(resolve => setTimeout(resolve, _classPrivateFieldLooseBase(this, _previousRetryDelay)[_previousRetryDelay]));
    }
  } else if (status === 429) {
    // HTTP 429 Too Many Requests => to avoid the whole download to fail, pause all requests.
    if (!requests.isPaused) {
      var _classPrivateFieldLoo2;

      const next = (_classPrivateFieldLoo2 = _classPrivateFieldLooseBase(this, _retryDelayIterator)[_retryDelayIterator]) == null ? void 0 : _classPrivateFieldLoo2.next();

      if (next == null || next.done) {
        return false;
      }

      requests.rateLimit(next.value);
    }
  } else if (status > 400 && status < 500 && status !== 409) {
    // HTTP 4xx, the server won't send anything, it's doesn't make sense to retry
    return false;
  } else if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    // The navigator is offline, let's wait for it to come back online.
    if (!requests.isPaused) {
      requests.pause();
      window.addEventListener('online', () => {
        requests.resume();
      }, {
        once: true
      });
    }
  } else {
    var _classPrivateFieldLoo3;

    // Other error code means the request can be retried later.
    const next = (_classPrivateFieldLoo3 = _classPrivateFieldLooseBase(this, _retryDelayIterator)[_retryDelayIterator]) == null ? void 0 : _classPrivateFieldLoo3.next();

    if (next == null || next.done) {
      return false;
    }

    await new Promise(resolve => setTimeout(resolve, next.value));
  }

  return true;
}

var _queueRequestSocketToken = /*#__PURE__*/_classPrivateFieldLooseKey("queueRequestSocketToken");

var _companionCommunicationQueue = /*#__PURE__*/_classPrivateFieldLooseKey("companionCommunicationQueue");

var _client = /*#__PURE__*/_classPrivateFieldLooseKey("client");

var _setS3MultipartState2 = /*#__PURE__*/_classPrivateFieldLooseKey("setS3MultipartState");

var _requestSocketToken = /*#__PURE__*/_classPrivateFieldLooseKey("requestSocketToken");

var _setCompanionHeaders = /*#__PURE__*/_classPrivateFieldLooseKey("setCompanionHeaders");

_Symbol$for = Symbol.for('uppy test: getClient');
export default class AwsS3Multipart extends BasePlugin {
  constructor(uppy, _opts) {
    var _this$opts$rateLimite;

    super(uppy, _opts);
    Object.defineProperty(this, _queueRequestSocketToken, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _companionCommunicationQueue, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _client, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _setS3MultipartState2, {
      writable: true,
      value: (file, _ref2) => {
        let {
          key,
          uploadId
        } = _ref2;
        const cFile = this.uppy.getFile(file.id);
        this.uppy.setFileState(file.id, {
          s3Multipart: { ...cFile.s3Multipart,
            key,
            uploadId
          }
        });
      }
    });
    Object.defineProperty(this, _requestSocketToken, {
      writable: true,
      value: async file => {
        const Client = file.remote.providerOptions.provider ? Provider : RequestClient;
        const client = new Client(this.uppy, file.remote.providerOptions);
        const opts = { ...this.opts
        };

        if (file.tus) {
          // Install file-specific upload overrides.
          Object.assign(opts, file.tus);
        }

        if (file.remote.url == null) {
          throw new Error('Cannot connect to an undefined URL');
        }

        const res = await client.post(file.remote.url, { ...file.remote.body,
          protocol: 's3-multipart',
          size: file.data.size,
          metadata: file.meta
        });
        return res.token;
      }
    });
    Object.defineProperty(this, _setCompanionHeaders, {
      writable: true,
      value: () => {
        _classPrivateFieldLooseBase(this, _client)[_client].setCompanionHeaders(this.opts.companionHeaders);
      }
    });
    this.type = 'uploader';
    this.id = this.opts.id || 'AwsS3Multipart';
    this.title = 'AWS S3 Multipart';
    _classPrivateFieldLooseBase(this, _client)[_client] = new RequestClient(uppy, _opts);
    const defaultOptions = {
      limit: 6,
      retryDelays: [0, 1000, 3000, 5000],
      createMultipartUpload: this.createMultipartUpload.bind(this),
      listParts: this.listParts.bind(this),
      abortMultipartUpload: this.abortMultipartUpload.bind(this),
      completeMultipartUpload: this.completeMultipartUpload.bind(this),
      signPart: this.signPart.bind(this),
      uploadPartBytes: AwsS3Multipart.uploadPartBytes,
      companionHeaders: {}
    };
    this.opts = { ...defaultOptions,
      ..._opts
    };

    if ((_opts == null ? void 0 : _opts.prepareUploadParts) != null && _opts.signPart == null) {
      this.opts.signPart = async (file, _ref3) => {
        let {
          uploadId,
          key,
          partNumber,
          body,
          signal
        } = _ref3;
        const {
          presignedUrls,
          headers
        } = await _opts.prepareUploadParts(file, {
          uploadId,
          key,
          parts: [{
            number: partNumber,
            chunk: body
          }],
          signal
        });
        return {
          url: presignedUrls == null ? void 0 : presignedUrls[partNumber],
          headers: headers == null ? void 0 : headers[partNumber]
        };
      };
    }

    this.upload = this.upload.bind(this);
    /**
     * Simultaneous upload limiting is shared across all uploads with this plugin.
     *
     * @type {RateLimitedQueue}
     */

    this.requests = (_this$opts$rateLimite = this.opts.rateLimitedQueue) != null ? _this$opts$rateLimite : new RateLimitedQueue(this.opts.limit);
    _classPrivateFieldLooseBase(this, _companionCommunicationQueue)[_companionCommunicationQueue] = new HTTPCommunicationQueue(this.requests, this.opts, _classPrivateFieldLooseBase(this, _setS3MultipartState2)[_setS3MultipartState2]);
    this.uploaders = Object.create(null);
    this.uploaderEvents = Object.create(null);
    this.uploaderSockets = Object.create(null);
    _classPrivateFieldLooseBase(this, _queueRequestSocketToken)[_queueRequestSocketToken] = this.requests.wrapPromiseFunction(_classPrivateFieldLooseBase(this, _requestSocketToken)[_requestSocketToken], {
      priority: -1
    });
  }

  [_Symbol$for]() {
    return _classPrivateFieldLooseBase(this, _client)[_client];
  }

  setOptions(newOptions) {
    _classPrivateFieldLooseBase(this, _companionCommunicationQueue)[_companionCommunicationQueue].setOptions(newOptions);

    return super.setOptions(newOptions);
  }
  /**
   * Clean up all references for a file's upload: the MultipartUploader instance,
   * any events related to the file, and the Companion WebSocket connection.
   *
   * Set `opts.abort` to tell S3 that the multipart upload is cancelled and must be removed.
   * This should be done when the user cancels the upload, not when the upload is completed or errored.
   */


  resetUploaderReferences(fileID, opts) {
    if (opts === void 0) {
      opts = {};
    }

    if (this.uploaders[fileID]) {
      this.uploaders[fileID].abort({
        really: opts.abort || false
      });
      this.uploaders[fileID] = null;
    }

    if (this.uploaderEvents[fileID]) {
      this.uploaderEvents[fileID].remove();
      this.uploaderEvents[fileID] = null;
    }

    if (this.uploaderSockets[fileID]) {
      this.uploaderSockets[fileID].close();
      this.uploaderSockets[fileID] = null;
    }
  } // TODO: make this a private method in the next major


  assertHost(method) {
    if (!this.opts.companionUrl) {
      throw new Error(`Expected a \`companionUrl\` option containing a Companion address, or if you are not using Companion, a custom \`${method}\` implementation.`);
    }
  }

  createMultipartUpload(file, signal) {
    this.assertHost('createMultipartUpload');
    throwIfAborted(signal);
    const metadata = {};
    Object.keys(file.meta || {}).forEach(key => {
      if (file.meta[key] != null) {
        metadata[key] = file.meta[key].toString();
      }
    });
    return _classPrivateFieldLooseBase(this, _client)[_client].post('s3/multipart', {
      filename: file.name,
      type: file.type,
      metadata
    }, {
      signal
    }).then(assertServerError);
  }

  listParts(file, _ref4, signal) {
    let {
      key,
      uploadId
    } = _ref4;
    this.assertHost('listParts');
    throwIfAborted(signal);
    const filename = encodeURIComponent(key);
    return _classPrivateFieldLooseBase(this, _client)[_client].get(`s3/multipart/${uploadId}?key=${filename}`, {
      signal
    }).then(assertServerError);
  }

  completeMultipartUpload(file, _ref5, signal) {
    let {
      key,
      uploadId,
      parts
    } = _ref5;
    this.assertHost('completeMultipartUpload');
    throwIfAborted(signal);
    const filename = encodeURIComponent(key);
    const uploadIdEnc = encodeURIComponent(uploadId);
    return _classPrivateFieldLooseBase(this, _client)[_client].post(`s3/multipart/${uploadIdEnc}/complete?key=${filename}`, {
      parts
    }, {
      signal
    }).then(assertServerError);
  }

  signPart(file, _ref6) {
    let {
      uploadId,
      key,
      partNumber,
      signal
    } = _ref6;
    this.assertHost('signPart');
    throwIfAborted(signal);

    if (uploadId == null || key == null || partNumber == null) {
      throw new Error('Cannot sign without a key, an uploadId, and a partNumber');
    }

    const filename = encodeURIComponent(key);
    return _classPrivateFieldLooseBase(this, _client)[_client].get(`s3/multipart/${uploadId}/${partNumber}?key=${filename}`, {
      signal
    }).then(assertServerError);
  }

  abortMultipartUpload(file, _ref7, signal) {
    let {
      key,
      uploadId
    } = _ref7;
    this.assertHost('abortMultipartUpload');
    const filename = encodeURIComponent(key);
    const uploadIdEnc = encodeURIComponent(uploadId);
    return _classPrivateFieldLooseBase(this, _client)[_client].delete(`s3/multipart/${uploadIdEnc}?key=${filename}`, undefined, {
      signal
    }).then(assertServerError);
  }

  static async uploadPartBytes(_ref8, body, signal) {
    let {
      url,
      expires,
      headers
    } = _ref8;
    throwIfAborted(signal);

    if (url == null) {
      throw new Error('Cannot upload to an undefined URL');
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url, true);

      if (headers) {
        Object.keys(headers).forEach(key => {
          xhr.setRequestHeader(key, headers[key]);
        });
      }

      xhr.responseType = 'text';

      if (typeof expires === 'number') {
        xhr.timeout = expires * 1000;
      }

      function onabort() {
        xhr.abort();
      }

      function cleanup() {
        signal.removeEventListener('abort', onabort);
      }

      signal.addEventListener('abort', onabort);
      xhr.upload.addEventListener('progress', body.onProgress);
      xhr.addEventListener('abort', () => {
        cleanup();
        reject(createAbortError());
      });
      xhr.addEventListener('timeout', () => {
        cleanup();
        const error = new Error('Request has expired');
        error.source = {
          status: 403
        };
        reject(error);
      });
      xhr.addEventListener('load', ev => {
        cleanup();

        if (ev.target.status === 403 && ev.target.responseText.includes('<Message>Request has expired</Message>')) {
          const error = new Error('Request has expired');
          error.source = ev.target;
          reject(error);
          return;
        }

        if (ev.target.status < 200 || ev.target.status >= 300) {
          const error = new Error('Non 2xx');
          error.source = ev.target;
          reject(error);
          return;
        }

        body.onProgress == null ? void 0 : body.onProgress(body.size); // NOTE This must be allowed by CORS.

        const etag = ev.target.getResponseHeader('ETag');

        if (etag === null) {
          reject(new Error('AwsS3/Multipart: Could not read the ETag header. This likely means CORS is not configured correctly on the S3 Bucket. See https://uppy.io/docs/aws-s3-multipart#S3-Bucket-Configuration for instructions.'));
          return;
        }

        body.onComplete == null ? void 0 : body.onComplete(etag);
        resolve({
          ETag: etag
        });
      });
      xhr.addEventListener('error', ev => {
        cleanup();
        const error = new Error('Unknown error');
        error.source = ev.target;
        reject(error);
      });
      xhr.send(body);
    });
  }

  uploadFile(file) {
    var _this = this;

    return new Promise((resolve, reject) => {
      const onProgress = (bytesUploaded, bytesTotal) => {
        this.uppy.emit('upload-progress', file, {
          uploader: this,
          bytesUploaded,
          bytesTotal
        });
      };

      const onError = err => {
        this.uppy.log(err);
        this.uppy.emit('upload-error', file, err);
        this.resetUploaderReferences(file.id);
        reject(err);
      };

      const onSuccess = result => {
        const uploadObject = upload; // eslint-disable-line no-use-before-define

        const uploadResp = {
          body: { ...result
          },
          uploadURL: result.location
        };
        this.resetUploaderReferences(file.id);
        const cFile = this.uppy.getFile(file.id);
        this.uppy.emit('upload-success', cFile || file, uploadResp);

        if (result.location) {
          this.uppy.log(`Download ${file.name} from ${result.location}`);
        }

        resolve(uploadObject);
      };

      const onPartComplete = part => {
        const cFile = this.uppy.getFile(file.id);

        if (!cFile) {
          return;
        }

        this.uppy.emit('s3-multipart:part-uploaded', cFile, part);
      };

      const upload = new MultipartUploader(file.data, {
        // .bind to pass the file object to each handler.
        companionComm: _classPrivateFieldLooseBase(this, _companionCommunicationQueue)[_companionCommunicationQueue],
        log: function () {
          return _this.uppy.log(...arguments);
        },
        getChunkSize: this.opts.getChunkSize ? this.opts.getChunkSize.bind(this) : null,
        onProgress,
        onError,
        onSuccess,
        onPartComplete,
        file,
        ...file.s3Multipart
      });
      this.uploaders[file.id] = upload;
      this.uploaderEvents[file.id] = new EventTracker(this.uppy);
      this.onFileRemove(file.id, removed => {
        upload.abort();
        this.resetUploaderReferences(file.id, {
          abort: true
        });
        resolve(`upload ${removed.id} was removed`);
      });
      this.onCancelAll(file.id, function (_temp) {
        let {
          reason
        } = _temp === void 0 ? {} : _temp;

        if (reason === 'user') {
          upload.abort();

          _this.resetUploaderReferences(file.id, {
            abort: true
          });
        }

        resolve(`upload ${file.id} was canceled`);
      });
      this.onFilePause(file.id, isPaused => {
        if (isPaused) {
          upload.pause();
        } else {
          upload.start();
        }
      });
      this.onPauseAll(file.id, () => {
        upload.pause();
      });
      this.onResumeAll(file.id, () => {
        upload.start();
      }); // Don't double-emit upload-started for Golden Retriever-restored files that were already started

      if (!file.progress.uploadStarted || !file.isRestored) {
        upload.start();
        this.uppy.emit('upload-started', file);
      }
    });
  }

  async uploadRemote(file) {
    this.resetUploaderReferences(file.id); // Don't double-emit upload-started for Golden Retriever-restored files that were already started

    if (!file.progress.uploadStarted || !file.isRestored) {
      this.uppy.emit('upload-started', file);
    }

    try {
      if (file.serverToken) {
        return this.connectToServerSocket(file);
      }

      const serverToken = await _classPrivateFieldLooseBase(this, _queueRequestSocketToken)[_queueRequestSocketToken](file);
      this.uppy.setFileState(file.id, {
        serverToken
      });
      return this.connectToServerSocket(this.uppy.getFile(file.id));
    } catch (err) {
      this.uppy.emit('upload-error', file, err);
      throw err;
    }
  }

  async connectToServerSocket(file) {
    var _this2 = this;

    return new Promise((resolve, reject) => {
      let queuedRequest;
      const token = file.serverToken;
      const host = getSocketHost(file.remote.companionUrl);
      const socket = new Socket({
        target: `${host}/api/${token}`
      });
      this.uploaderSockets[file.id] = socket;
      this.uploaderEvents[file.id] = new EventTracker(this.uppy);
      this.onFileRemove(file.id, () => {
        queuedRequest.abort();
        socket.send('cancel', {});
        this.resetUploaderReferences(file.id, {
          abort: true
        });
        resolve(`upload ${file.id} was removed`);
      });
      this.onFilePause(file.id, isPaused => {
        if (isPaused) {
          // Remove this file from the queue so another file can start in its place.
          queuedRequest.abort();
          socket.send('pause', {});
        } else {
          // Resuming an upload should be queued, else you could pause and then
          // resume a queued upload to make it skip the queue.
          queuedRequest.abort();
          queuedRequest = this.requests.run(() => {
            socket.send('resume', {});
            return () => {};
          });
        }
      });
      this.onPauseAll(file.id, () => {
        queuedRequest.abort();
        socket.send('pause', {});
      });
      this.onCancelAll(file.id, function (_temp2) {
        let {
          reason
        } = _temp2 === void 0 ? {} : _temp2;

        if (reason === 'user') {
          queuedRequest.abort();
          socket.send('cancel', {});

          _this2.resetUploaderReferences(file.id);
        }

        resolve(`upload ${file.id} was canceled`);
      });
      this.onResumeAll(file.id, () => {
        queuedRequest.abort();

        if (file.error) {
          socket.send('pause', {});
        }

        queuedRequest = this.requests.run(() => {
          socket.send('resume', {});
        });
      });
      this.onRetry(file.id, () => {
        // Only do the retry if the upload is actually in progress;
        // else we could try to send these messages when the upload is still queued.
        // We may need a better check for this since the socket may also be closed
        // for other reasons, like network failures.
        if (socket.isOpen) {
          socket.send('pause', {});
          socket.send('resume', {});
        }
      });
      this.onRetryAll(file.id, () => {
        if (socket.isOpen) {
          socket.send('pause', {});
          socket.send('resume', {});
        }
      });
      socket.on('progress', progressData => emitSocketProgress(this, progressData, file));
      socket.on('error', errData => {
        this.uppy.emit('upload-error', file, new Error(errData.error));
        this.resetUploaderReferences(file.id);
        queuedRequest.done();
        reject(new Error(errData.error));
      });
      socket.on('success', data => {
        const uploadResp = {
          uploadURL: data.url
        };
        this.uppy.emit('upload-success', file, uploadResp);
        this.resetUploaderReferences(file.id);
        queuedRequest.done();
        resolve();
      });
      queuedRequest = this.requests.run(() => {
        if (file.isPaused) {
          socket.send('pause', {});
        }

        return () => {};
      });
    });
  }

  async upload(fileIDs) {
    if (fileIDs.length === 0) return undefined;
    const promises = fileIDs.map(id => {
      const file = this.uppy.getFile(id);

      if (file.isRemote) {
        return this.uploadRemote(file);
      }

      return this.uploadFile(file);
    });
    return Promise.all(promises);
  }

  onFileRemove(fileID, cb) {
    this.uploaderEvents[fileID].on('file-removed', file => {
      if (fileID === file.id) cb(file.id);
    });
  }

  onFilePause(fileID, cb) {
    this.uploaderEvents[fileID].on('upload-pause', (targetFileID, isPaused) => {
      if (fileID === targetFileID) {
        cb(isPaused);
      }
    });
  }

  onRetry(fileID, cb) {
    this.uploaderEvents[fileID].on('upload-retry', targetFileID => {
      if (fileID === targetFileID) {
        cb();
      }
    });
  }

  onRetryAll(fileID, cb) {
    this.uploaderEvents[fileID].on('retry-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }

  onPauseAll(fileID, cb) {
    this.uploaderEvents[fileID].on('pause-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }

  onCancelAll(fileID, eventHandler) {
    var _this3 = this;

    this.uploaderEvents[fileID].on('cancel-all', function () {
      if (!_this3.uppy.getFile(fileID)) return;
      eventHandler(...arguments);
    });
  }

  onResumeAll(fileID, cb) {
    this.uploaderEvents[fileID].on('resume-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }

  install() {
    const {
      capabilities
    } = this.uppy.getState();
    this.uppy.setState({
      capabilities: { ...capabilities,
        resumableUploads: true
      }
    });
    this.uppy.addPreProcessor(_classPrivateFieldLooseBase(this, _setCompanionHeaders)[_setCompanionHeaders]);
    this.uppy.addUploader(this.upload);
  }

  uninstall() {
    const {
      capabilities
    } = this.uppy.getState();
    this.uppy.setState({
      capabilities: { ...capabilities,
        resumableUploads: false
      }
    });
    this.uppy.removePreProcessor(_classPrivateFieldLooseBase(this, _setCompanionHeaders)[_setCompanionHeaders]);
    this.uppy.removeUploader(this.upload);
  }

}
AwsS3Multipart.VERSION = packageJson.version;