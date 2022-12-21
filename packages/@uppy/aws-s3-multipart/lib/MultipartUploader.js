function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

import { AbortController } from '@uppy/utils/lib/AbortController';
const MB = 1024 * 1024;
const defaultOptions = {
  getChunkSize(file) {
    return Math.ceil(file.size / 10000);
  },

  onProgress() {},

  onPartComplete() {},

  onSuccess() {},

  onError(err) {
    throw err;
  }

};

function ensureInt(value) {
  if (typeof value === 'string') {
    return parseInt(value, 10);
  }

  if (typeof value === 'number') {
    return value;
  }

  throw new TypeError('Expected a number');
}

const pausingUploadReason = Symbol('pausing upload, not an actual error');

var _abortController = /*#__PURE__*/_classPrivateFieldLooseKey("abortController");

var _chunks = /*#__PURE__*/_classPrivateFieldLooseKey("chunks");

var _chunkState = /*#__PURE__*/_classPrivateFieldLooseKey("chunkState");

var _data = /*#__PURE__*/_classPrivateFieldLooseKey("data");

var _file = /*#__PURE__*/_classPrivateFieldLooseKey("file");

var _uploadPromise = /*#__PURE__*/_classPrivateFieldLooseKey("uploadPromise");

var _onError = /*#__PURE__*/_classPrivateFieldLooseKey("onError");

var _onSuccess = /*#__PURE__*/_classPrivateFieldLooseKey("onSuccess");

var _onReject = /*#__PURE__*/_classPrivateFieldLooseKey("onReject");

var _initChunks = /*#__PURE__*/_classPrivateFieldLooseKey("initChunks");

var _createUpload = /*#__PURE__*/_classPrivateFieldLooseKey("createUpload");

var _resumeUpload = /*#__PURE__*/_classPrivateFieldLooseKey("resumeUpload");

var _onPartProgress = /*#__PURE__*/_classPrivateFieldLooseKey("onPartProgress");

var _onPartComplete = /*#__PURE__*/_classPrivateFieldLooseKey("onPartComplete");

var _abortUpload = /*#__PURE__*/_classPrivateFieldLooseKey("abortUpload");

class MultipartUploader {
  constructor(data, options) {
    var _this$options, _this$options$getChun;

    Object.defineProperty(this, _abortUpload, {
      value: _abortUpload2
    });
    Object.defineProperty(this, _resumeUpload, {
      value: _resumeUpload2
    });
    Object.defineProperty(this, _createUpload, {
      value: _createUpload2
    });
    Object.defineProperty(this, _initChunks, {
      value: _initChunks2
    });
    Object.defineProperty(this, _abortController, {
      writable: true,
      value: new AbortController()
    });
    Object.defineProperty(this, _chunks, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _chunkState, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _data, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _file, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _uploadPromise, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _onError, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _onSuccess, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _onReject, {
      writable: true,
      value: err => (err == null ? void 0 : err.cause) === pausingUploadReason ? null : _classPrivateFieldLooseBase(this, _onError)[_onError](err)
    });
    Object.defineProperty(this, _onPartProgress, {
      writable: true,
      value: index => ev => {
        if (!ev.lengthComputable) return;
        const sent = ev.loaded;
        _classPrivateFieldLooseBase(this, _chunkState)[_chunkState][index].uploaded = ensureInt(sent);

        const totalUploaded = _classPrivateFieldLooseBase(this, _chunkState)[_chunkState].reduce((n, c) => n + c.uploaded, 0);

        this.options.onProgress(totalUploaded, _classPrivateFieldLooseBase(this, _data)[_data].size);
      }
    });
    Object.defineProperty(this, _onPartComplete, {
      writable: true,
      value: index => etag => {
        // This avoids the net::ERR_OUT_OF_MEMORY in Chromium Browsers.
        _classPrivateFieldLooseBase(this, _chunks)[_chunks][index] = null;
        _classPrivateFieldLooseBase(this, _chunkState)[_chunkState][index].etag = etag;
        _classPrivateFieldLooseBase(this, _chunkState)[_chunkState][index].done = true;
        const part = {
          PartNumber: index + 1,
          ETag: etag
        };
        this.options.onPartComplete(part);
      }
    });
    this.options = { ...defaultOptions,
      ...options
    }; // Use default `getChunkSize` if it was null or something

    (_this$options$getChun = (_this$options = this.options).getChunkSize) != null ? _this$options$getChun : _this$options.getChunkSize = defaultOptions.getChunkSize;
    _classPrivateFieldLooseBase(this, _data)[_data] = data;
    _classPrivateFieldLooseBase(this, _file)[_file] = options.file;
    _classPrivateFieldLooseBase(this, _onSuccess)[_onSuccess] = this.options.onSuccess;
    _classPrivateFieldLooseBase(this, _onError)[_onError] = this.options.onError;

    _classPrivateFieldLooseBase(this, _initChunks)[_initChunks]();
  }

  start() {
    if (_classPrivateFieldLooseBase(this, _uploadPromise)[_uploadPromise]) {
      if (!_classPrivateFieldLooseBase(this, _abortController)[_abortController].signal.aborted) _classPrivateFieldLooseBase(this, _abortController)[_abortController].abort(pausingUploadReason);
      _classPrivateFieldLooseBase(this, _abortController)[_abortController] = new AbortController();

      _classPrivateFieldLooseBase(this, _resumeUpload)[_resumeUpload]();
    } else {
      _classPrivateFieldLooseBase(this, _createUpload)[_createUpload]();
    }
  }

  pause() {
    _classPrivateFieldLooseBase(this, _abortController)[_abortController].abort(pausingUploadReason); // Swap it out for a new controller, because this instance may be resumed later.


    _classPrivateFieldLooseBase(this, _abortController)[_abortController] = new AbortController();
  }

  abort(opts) {
    var _opts;

    if (opts === void 0) {
      opts = undefined;
    }

    if ((_opts = opts) != null && _opts.really) _classPrivateFieldLooseBase(this, _abortUpload)[_abortUpload]();else this.pause();
  } // TODO: remove this in the next major


  get chunkState() {
    return _classPrivateFieldLooseBase(this, _chunkState)[_chunkState];
  }

}

function _initChunks2() {
  const desiredChunkSize = this.options.getChunkSize(_classPrivateFieldLooseBase(this, _data)[_data]); // at least 5MB per request, at most 10k requests

  const fileSize = _classPrivateFieldLooseBase(this, _data)[_data].size;

  const minChunkSize = Math.max(5 * MB, Math.ceil(fileSize / 10000));
  const chunkSize = Math.max(desiredChunkSize, minChunkSize); // Upload zero-sized files in one zero-sized chunk

  if (_classPrivateFieldLooseBase(this, _data)[_data].size === 0) {
    _classPrivateFieldLooseBase(this, _chunks)[_chunks] = [_classPrivateFieldLooseBase(this, _data)[_data]];
    _classPrivateFieldLooseBase(this, _data)[_data].onProgress = _classPrivateFieldLooseBase(this, _onPartProgress)[_onPartProgress](0);
    _classPrivateFieldLooseBase(this, _data)[_data].onComplete = _classPrivateFieldLooseBase(this, _onPartComplete)[_onPartComplete](0);
  } else {
    const arraySize = Math.ceil(fileSize / chunkSize);
    _classPrivateFieldLooseBase(this, _chunks)[_chunks] = Array(arraySize);
    let j = 0;

    for (let i = 0; i < fileSize; i += chunkSize) {
      const end = Math.min(fileSize, i + chunkSize);

      const chunk = _classPrivateFieldLooseBase(this, _data)[_data].slice(i, end);

      chunk.onProgress = _classPrivateFieldLooseBase(this, _onPartProgress)[_onPartProgress](j);
      chunk.onComplete = _classPrivateFieldLooseBase(this, _onPartComplete)[_onPartComplete](j);
      _classPrivateFieldLooseBase(this, _chunks)[_chunks][j++] = chunk;
    }
  }

  _classPrivateFieldLooseBase(this, _chunkState)[_chunkState] = _classPrivateFieldLooseBase(this, _chunks)[_chunks].map(() => ({
    uploaded: 0
  }));
}

function _createUpload2() {
  _classPrivateFieldLooseBase(this, _uploadPromise)[_uploadPromise] = this.options.companionComm.uploadFile(_classPrivateFieldLooseBase(this, _file)[_file], _classPrivateFieldLooseBase(this, _chunks)[_chunks], _classPrivateFieldLooseBase(this, _abortController)[_abortController].signal).then(_classPrivateFieldLooseBase(this, _onSuccess)[_onSuccess], _classPrivateFieldLooseBase(this, _onReject)[_onReject]);
}

function _resumeUpload2() {
  _classPrivateFieldLooseBase(this, _uploadPromise)[_uploadPromise] = this.options.companionComm.resumeUploadFile(_classPrivateFieldLooseBase(this, _file)[_file], _classPrivateFieldLooseBase(this, _chunks)[_chunks], _classPrivateFieldLooseBase(this, _abortController)[_abortController].signal).then(_classPrivateFieldLooseBase(this, _onSuccess)[_onSuccess], _classPrivateFieldLooseBase(this, _onReject)[_onReject]);
}

function _abortUpload2() {
  _classPrivateFieldLooseBase(this, _abortController)[_abortController].abort();

  this.options.companionComm.abortFileUpload(_classPrivateFieldLooseBase(this, _file)[_file]).catch(err => this.options.log(err));
}

export default MultipartUploader;