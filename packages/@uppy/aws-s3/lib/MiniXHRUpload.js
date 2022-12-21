function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

import { nanoid } from 'nanoid/non-secure';
import { Provider, RequestClient, Socket } from '@uppy/companion-client';
import emitSocketProgress from '@uppy/utils/lib/emitSocketProgress';
import getSocketHost from '@uppy/utils/lib/getSocketHost';
import EventTracker from '@uppy/utils/lib/EventTracker';
import ProgressTimeout from '@uppy/utils/lib/ProgressTimeout';
import ErrorWithCause from '@uppy/utils/lib/ErrorWithCause';
import NetworkError from '@uppy/utils/lib/NetworkError';
import isNetworkError from '@uppy/utils/lib/isNetworkError';
import { internalRateLimitedQueue } from '@uppy/utils/lib/RateLimitedQueue'; // See XHRUpload

function buildResponseError(xhr, error) {
  if (isNetworkError(xhr)) return new NetworkError(error, xhr);
  const err = new ErrorWithCause('Upload error', {
    cause: error
  });
  err.request = xhr;
  return err;
} // See XHRUpload


function setTypeInBlob(file) {
  const dataWithUpdatedType = file.data.slice(0, file.data.size, file.meta.type);
  return dataWithUpdatedType;
}

function addMetadata(formData, meta, opts) {
  const allowedMetaFields = Array.isArray(opts.allowedMetaFields) ? opts.allowedMetaFields // Send along all fields by default.
  : Object.keys(meta);
  allowedMetaFields.forEach(item => {
    formData.append(item, meta[item]);
  });
}

function createFormDataUpload(file, opts) {
  const formPost = new FormData();
  addMetadata(formPost, file.meta, opts);
  const dataWithUpdatedType = setTypeInBlob(file);

  if (file.name) {
    formPost.append(opts.fieldName, dataWithUpdatedType, file.meta.name);
  } else {
    formPost.append(opts.fieldName, dataWithUpdatedType);
  }

  return formPost;
}

const createBareUpload = file => file.data;

var _queueRequestSocketToken = /*#__PURE__*/_classPrivateFieldLooseKey("queueRequestSocketToken");

var _getOptions = /*#__PURE__*/_classPrivateFieldLooseKey("getOptions");

var _addEventHandlerForFile = /*#__PURE__*/_classPrivateFieldLooseKey("addEventHandlerForFile");

var _addEventHandlerIfFileStillExists = /*#__PURE__*/_classPrivateFieldLooseKey("addEventHandlerIfFileStillExists");

var _uploadLocalFile = /*#__PURE__*/_classPrivateFieldLooseKey("uploadLocalFile");

var _requestSocketToken = /*#__PURE__*/_classPrivateFieldLooseKey("requestSocketToken");

var _uploadRemoteFile = /*#__PURE__*/_classPrivateFieldLooseKey("uploadRemoteFile");

export default class MiniXHRUpload {
  constructor(_uppy, _opts) {
    Object.defineProperty(this, _uploadRemoteFile, {
      value: _uploadRemoteFile2
    });
    Object.defineProperty(this, _uploadLocalFile, {
      value: _uploadLocalFile2
    });
    Object.defineProperty(this, _addEventHandlerIfFileStillExists, {
      value: _addEventHandlerIfFileStillExists2
    });
    Object.defineProperty(this, _addEventHandlerForFile, {
      value: _addEventHandlerForFile2
    });
    Object.defineProperty(this, _getOptions, {
      value: _getOptions2
    });
    Object.defineProperty(this, _queueRequestSocketToken, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _requestSocketToken, {
      writable: true,
      value: async file => {
        const opts = _classPrivateFieldLooseBase(this, _getOptions)[_getOptions](file);

        const Client = file.remote.providerOptions.provider ? Provider : RequestClient;
        const client = new Client(this.uppy, file.remote.providerOptions);
        const allowedMetaFields = Array.isArray(opts.allowedMetaFields) ? opts.allowedMetaFields // Send along all fields by default.
        : Object.keys(file.meta);

        if (file.tus) {
          // Install file-specific upload overrides.
          Object.assign(opts, file.tus);
        }

        const res = await client.post(file.remote.url, { ...file.remote.body,
          protocol: 'multipart',
          endpoint: opts.endpoint,
          size: file.data.size,
          fieldname: opts.fieldName,
          metadata: Object.fromEntries(allowedMetaFields.map(name => [name, file.meta[name]])),
          httpMethod: opts.method,
          useFormData: opts.formData,
          headers: opts.headers
        });
        return res.token;
      }
    });
    this.uppy = _uppy;
    this.opts = {
      validateStatus(status) {
        return status >= 200 && status < 300;
      },

      ..._opts
    };
    this.requests = _opts[internalRateLimitedQueue];
    this.uploaderEvents = Object.create(null);
    this.i18n = _opts.i18n;
    _classPrivateFieldLooseBase(this, _queueRequestSocketToken)[_queueRequestSocketToken] = this.requests.wrapPromiseFunction(_classPrivateFieldLooseBase(this, _requestSocketToken)[_requestSocketToken], {
      priority: -1
    });
  }

  uploadFile(id, current, total) {
    const file = this.uppy.getFile(id);

    if (file.error) {
      throw new Error(file.error);
    } else if (file.isRemote) {
      return _classPrivateFieldLooseBase(this, _uploadRemoteFile)[_uploadRemoteFile](file, current, total);
    }

    return _classPrivateFieldLooseBase(this, _uploadLocalFile)[_uploadLocalFile](file, current, total);
  }

  connectToServerSocket(file) {
    return new Promise((resolve, reject) => {
      const opts = _classPrivateFieldLooseBase(this, _getOptions)[_getOptions](file);

      const token = file.serverToken;
      const host = getSocketHost(file.remote.companionUrl);
      let socket;

      const createSocket = () => {
        if (socket != null) return;
        socket = new Socket({
          target: `${host}/api/${token}`
        });
        socket.on('progress', progressData => emitSocketProgress(this, progressData, file));
        socket.on('success', data => {
          const body = opts.getResponseData(data.response.responseText, data.response);
          const uploadURL = body[opts.responseUrlFieldName];
          const uploadResp = {
            status: data.response.status,
            body,
            uploadURL,
            bytesUploaded: data.bytesUploaded
          };
          this.uppy.emit('upload-success', file, uploadResp);
          queuedRequest.done(); // eslint-disable-line no-use-before-define

          socket.close();

          if (this.uploaderEvents[file.id]) {
            this.uploaderEvents[file.id].remove();
            this.uploaderEvents[file.id] = null;
          }

          return resolve();
        });
        socket.on('error', errData => {
          const resp = errData.response;
          const error = resp ? opts.getResponseError(resp.responseText, resp) : new ErrorWithCause(errData.error.message, {
            cause: errData.error
          });
          this.uppy.emit('upload-error', file, error);
          queuedRequest.done(); // eslint-disable-line no-use-before-define

          if (this.uploaderEvents[file.id]) {
            this.uploaderEvents[file.id].remove();
            this.uploaderEvents[file.id] = null;
          }

          reject(error);
        });
      };

      this.uploaderEvents[file.id] = new EventTracker(this.uppy);
      let queuedRequest = this.requests.run(() => {
        if (file.isPaused) {
          var _socket;

          (_socket = socket) == null ? void 0 : _socket.send('pause', {});
        } else {
          createSocket();
        }

        return () => socket.close();
      });

      _classPrivateFieldLooseBase(this, _addEventHandlerForFile)[_addEventHandlerForFile]('file-removed', file.id, () => {
        var _socket2;

        (_socket2 = socket) == null ? void 0 : _socket2.send('cancel', {});
        queuedRequest.abort();
        resolve(`upload ${file.id} was removed`);
      });

      _classPrivateFieldLooseBase(this, _addEventHandlerIfFileStillExists)[_addEventHandlerIfFileStillExists]('cancel-all', file.id, function (_temp) {
        let {
          reason
        } = _temp === void 0 ? {} : _temp;

        if (reason === 'user') {
          var _socket3;

          (_socket3 = socket) == null ? void 0 : _socket3.send('cancel', {});
          queuedRequest.abort();
        }

        resolve(`upload ${file.id} was canceled`);
      });

      const onRetryRequest = () => {
        if (socket == null) {
          queuedRequest.abort();
        } else {
          socket.send('pause', {});
          queuedRequest.done();
        }

        queuedRequest = this.requests.run(() => {
          if (!file.isPaused) {
            if (socket == null) {
              createSocket();
            } else {
              socket.send('resume', {});
            }
          }

          return () => socket.close();
        });
      };

      _classPrivateFieldLooseBase(this, _addEventHandlerForFile)[_addEventHandlerForFile]('upload-retry', file.id, onRetryRequest);

      _classPrivateFieldLooseBase(this, _addEventHandlerIfFileStillExists)[_addEventHandlerIfFileStillExists]('retry-all', file.id, onRetryRequest);
    }).catch(err => {
      this.uppy.emit('upload-error', file, err);
      return Promise.reject(err);
    });
  }

}

function _getOptions2(file) {
  var _file$xhrUpload;

  const {
    uppy
  } = this;
  const overrides = uppy.getState().xhrUpload;
  const opts = { ...this.opts,
    ...(overrides || {}),
    ...(file.xhrUpload || {}),
    headers: { ...this.opts.headers,
      ...(overrides == null ? void 0 : overrides.headers),
      ...((_file$xhrUpload = file.xhrUpload) == null ? void 0 : _file$xhrUpload.headers)
    }
  };
  return opts;
}

function _addEventHandlerForFile2(eventName, fileID, eventHandler) {
  this.uploaderEvents[fileID].on(eventName, fileOrID => {
    var _fileOrID$id;

    // TODO (major): refactor Uppy events to consistently send file objects (or consistently IDs)
    // We created a generic `addEventListenerForFile` but not all events
    // use file IDs, some use files, so we need to do this weird check.
    const id = (_fileOrID$id = fileOrID == null ? void 0 : fileOrID.id) != null ? _fileOrID$id : fileOrID;
    if (fileID === id) eventHandler();
  });
}

function _addEventHandlerIfFileStillExists2(eventName, fileID, eventHandler) {
  var _this = this;

  this.uploaderEvents[fileID].on(eventName, function () {
    if (_this.uppy.getFile(fileID)) eventHandler(...arguments);
  });
}

function _uploadLocalFile2(file, current, total) {
  const opts = _classPrivateFieldLooseBase(this, _getOptions)[_getOptions](file);

  this.uppy.log(`uploading ${current} of ${total}`);
  return new Promise((resolve, reject) => {
    // This is done in index.js in the S3 plugin.
    // this.uppy.emit('upload-started', file)
    const data = opts.formData ? createFormDataUpload(file, opts) : createBareUpload(file, opts);
    const xhr = new XMLHttpRequest();
    this.uploaderEvents[file.id] = new EventTracker(this.uppy);
    const timer = new ProgressTimeout(opts.timeout, () => {
      xhr.abort(); // eslint-disable-next-line no-use-before-define

      queuedRequest.done();
      const error = new Error(this.i18n('timedOut', {
        seconds: Math.ceil(opts.timeout / 1000)
      }));
      this.uppy.emit('upload-error', file, error);
      reject(error);
    });
    const id = nanoid();
    xhr.upload.addEventListener('loadstart', () => {
      this.uppy.log(`[AwsS3/XHRUpload] ${id} started`);
    });
    xhr.upload.addEventListener('progress', ev => {
      this.uppy.log(`[AwsS3/XHRUpload] ${id} progress: ${ev.loaded} / ${ev.total}`); // Begin checking for timeouts when progress starts, instead of loading,
      // to avoid timing out requests on browser concurrency queue

      timer.progress();

      if (ev.lengthComputable) {
        this.uppy.emit('upload-progress', file, {
          uploader: this,
          bytesUploaded: ev.loaded,
          bytesTotal: ev.total
        });
      }
    });
    xhr.addEventListener('load', ev => {
      this.uppy.log(`[AwsS3/XHRUpload] ${id} finished`);
      timer.done(); // eslint-disable-next-line no-use-before-define

      queuedRequest.done();

      if (this.uploaderEvents[file.id]) {
        this.uploaderEvents[file.id].remove();
        this.uploaderEvents[file.id] = null;
      }

      if (opts.validateStatus(ev.target.status, xhr.responseText, xhr)) {
        const body = opts.getResponseData(xhr.responseText, xhr);
        const uploadURL = body[opts.responseUrlFieldName];
        const uploadResp = {
          status: ev.target.status,
          body,
          uploadURL
        };
        this.uppy.emit('upload-success', file, uploadResp);

        if (uploadURL) {
          this.uppy.log(`Download ${file.name} from ${uploadURL}`);
        }

        return resolve(file);
      }

      const body = opts.getResponseData(xhr.responseText, xhr);
      const error = buildResponseError(xhr, opts.getResponseError(xhr.responseText, xhr));
      const response = {
        status: ev.target.status,
        body
      };
      this.uppy.emit('upload-error', file, error, response);
      return reject(error);
    });
    xhr.addEventListener('error', () => {
      this.uppy.log(`[AwsS3/XHRUpload] ${id} errored`);
      timer.done(); // eslint-disable-next-line no-use-before-define

      queuedRequest.done();

      if (this.uploaderEvents[file.id]) {
        this.uploaderEvents[file.id].remove();
        this.uploaderEvents[file.id] = null;
      }

      const error = buildResponseError(xhr, opts.getResponseError(xhr.responseText, xhr));
      this.uppy.emit('upload-error', file, error);
      return reject(error);
    });
    xhr.open(opts.method.toUpperCase(), opts.endpoint, true); // IE10 does not allow setting `withCredentials` and `responseType`
    // before `open()` is called. It’s important to set withCredentials
    // to a boolean, otherwise React Native crashes

    xhr.withCredentials = Boolean(opts.withCredentials);

    if (opts.responseType !== '') {
      xhr.responseType = opts.responseType;
    }

    Object.keys(opts.headers).forEach(header => {
      xhr.setRequestHeader(header, opts.headers[header]);
    });
    const queuedRequest = this.requests.run(() => {
      xhr.send(data);
      return () => {
        // eslint-disable-next-line no-use-before-define
        timer.done();
        xhr.abort();
      };
    }, {
      priority: 1
    });

    _classPrivateFieldLooseBase(this, _addEventHandlerForFile)[_addEventHandlerForFile]('file-removed', file.id, () => {
      queuedRequest.abort();
      reject(new Error('File removed'));
    });

    _classPrivateFieldLooseBase(this, _addEventHandlerIfFileStillExists)[_addEventHandlerIfFileStillExists]('cancel-all', file.id, function (_temp2) {
      let {
        reason
      } = _temp2 === void 0 ? {} : _temp2;

      if (reason === 'user') {
        queuedRequest.abort();
      }

      reject(new Error('Upload cancelled'));
    });
  });
}

async function _uploadRemoteFile2(file) {
  // TODO: we could rewrite this to use server-sent events instead of creating WebSockets.
  try {
    if (file.serverToken) {
      return this.connectToServerSocket(file);
    }

    const serverToken = await _classPrivateFieldLooseBase(this, _queueRequestSocketToken)[_queueRequestSocketToken](file);
    if (!this.uppy.getState().files[file.id]) return undefined;
    this.uppy.setFileState(file.id, {
      serverToken
    });
    return this.connectToServerSocket(this.uppy.getFile(file.id));
  } catch (err) {
    this.uppy.emit('upload-error', file, err);
    throw err;
  }
}