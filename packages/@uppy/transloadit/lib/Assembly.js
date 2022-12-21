function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

import Emitter from 'component-emitter';
import { io } from 'socket.io-client';
import has from '@uppy/utils/lib/hasProperty';
import NetworkError from '@uppy/utils/lib/NetworkError';
import fetchWithNetworkError from '@uppy/utils/lib/fetchWithNetworkError';
import parseUrl from './parseUrl.js';
const ASSEMBLY_UPLOADING = 'ASSEMBLY_UPLOADING';
const ASSEMBLY_EXECUTING = 'ASSEMBLY_EXECUTING';
const ASSEMBLY_COMPLETED = 'ASSEMBLY_COMPLETED';
const statusOrder = [ASSEMBLY_UPLOADING, ASSEMBLY_EXECUTING, ASSEMBLY_COMPLETED];
/**
 * Check that an assembly status is equal to or larger than some desired status.
 * It checks for things that are larger so that a comparison like this works,
 * when the old assembly status is UPLOADING but the new is FINISHED:
 *
 * !isStatus(oldStatus, ASSEMBLY_EXECUTING) && isStatus(newState, ASSEMBLY_EXECUTING)
 *
 * …so that we can emit the 'executing' event even if the execution step was so
 * fast that we missed it.
 */

function isStatus(status, test) {
  return statusOrder.indexOf(status) >= statusOrder.indexOf(test);
}

var _rateLimitedQueue = /*#__PURE__*/_classPrivateFieldLooseKey("rateLimitedQueue");

var _fetchWithNetworkError = /*#__PURE__*/_classPrivateFieldLooseKey("fetchWithNetworkError");

var _previousFetchStatusStillPending = /*#__PURE__*/_classPrivateFieldLooseKey("previousFetchStatusStillPending");

var _onFinished = /*#__PURE__*/_classPrivateFieldLooseKey("onFinished");

var _connectSocket = /*#__PURE__*/_classPrivateFieldLooseKey("connectSocket");

var _onError = /*#__PURE__*/_classPrivateFieldLooseKey("onError");

var _beginPolling = /*#__PURE__*/_classPrivateFieldLooseKey("beginPolling");

var _fetchStatus = /*#__PURE__*/_classPrivateFieldLooseKey("fetchStatus");

var _diffStatus = /*#__PURE__*/_classPrivateFieldLooseKey("diffStatus");

class TransloaditAssembly extends Emitter {
  constructor(assembly, rateLimitedQueue) {
    super(); // The current assembly status.

    Object.defineProperty(this, _diffStatus, {
      value: _diffStatus2
    });
    Object.defineProperty(this, _fetchStatus, {
      value: _fetchStatus2
    });
    Object.defineProperty(this, _beginPolling, {
      value: _beginPolling2
    });
    Object.defineProperty(this, _onError, {
      value: _onError2
    });
    Object.defineProperty(this, _connectSocket, {
      value: _connectSocket2
    });
    Object.defineProperty(this, _onFinished, {
      value: _onFinished2
    });
    Object.defineProperty(this, _rateLimitedQueue, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _fetchWithNetworkError, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _previousFetchStatusStillPending, {
      writable: true,
      value: false
    });
    this.status = assembly; // The socket.io connection.

    this.socket = null; // The interval timer for full status updates.

    this.pollInterval = null; // Whether this assembly has been closed (finished or errored)

    this.closed = false;
    _classPrivateFieldLooseBase(this, _rateLimitedQueue)[_rateLimitedQueue] = rateLimitedQueue;
    _classPrivateFieldLooseBase(this, _fetchWithNetworkError)[_fetchWithNetworkError] = rateLimitedQueue.wrapPromiseFunction(fetchWithNetworkError);
  }

  connect() {
    _classPrivateFieldLooseBase(this, _connectSocket)[_connectSocket]();

    _classPrivateFieldLooseBase(this, _beginPolling)[_beginPolling]();
  }

  update() {
    return _classPrivateFieldLooseBase(this, _fetchStatus)[_fetchStatus]({
      diff: true
    });
  }
  /**
   * Update this assembly's status with a full new object. Events will be
   * emitted for status changes, new files, and new results.
   *
   * @param {object} next The new assembly status object.
   */


  updateStatus(next) {
    _classPrivateFieldLooseBase(this, _diffStatus)[_diffStatus](this.status, next);

    this.status = next;
  }
  /**
   * Diff two assembly statuses, and emit the events necessary to go from `prev`
   * to `next`.
   *
   * @param {object} prev The previous assembly status.
   * @param {object} next The new assembly status.
   */


  /**
   * Stop updating this assembly.
   */
  close() {
    this.closed = true;

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    clearInterval(this.pollInterval);
    this.pollInterval = null;
  }

}

function _onFinished2() {
  this.emit('finished');
  this.close();
}

function _connectSocket2() {
  const parsed = parseUrl(this.status.websocket_url);
  const socket = io(parsed.origin, {
    transports: ['websocket'],
    path: parsed.pathname
  });
  socket.on('connect', () => {
    socket.emit('assembly_connect', {
      id: this.status.assembly_id
    });
    this.emit('connect');
  });
  socket.on('connect_error', () => {
    socket.disconnect();
    this.socket = null;
  });
  socket.on('assembly_finished', () => {
    _classPrivateFieldLooseBase(this, _onFinished)[_onFinished]();
  });
  socket.on('assembly_upload_finished', file => {
    this.emit('upload', file);
    this.status.uploads.push(file);
  });
  socket.on('assembly_uploading_finished', () => {
    this.emit('executing');
  });
  socket.on('assembly_upload_meta_data_extracted', () => {
    this.emit('metadata');

    _classPrivateFieldLooseBase(this, _fetchStatus)[_fetchStatus]({
      diff: false
    });
  });
  socket.on('assembly_result_finished', (stepName, result) => {
    this.emit('result', stepName, result);

    if (!this.status.results[stepName]) {
      this.status.results[stepName] = [];
    }

    this.status.results[stepName].push(result);
  });
  socket.on('assembly_error', err => {
    _classPrivateFieldLooseBase(this, _onError)[_onError](err); // Refetch for updated status code


    _classPrivateFieldLooseBase(this, _fetchStatus)[_fetchStatus]({
      diff: false
    });
  });
  this.socket = socket;
}

function _onError2(err) {
  this.emit('error', Object.assign(new Error(err.message), err));
  this.close();
}

function _beginPolling2() {
  this.pollInterval = setInterval(() => {
    if (!this.socket || !this.socket.connected) {
      _classPrivateFieldLooseBase(this, _fetchStatus)[_fetchStatus]();
    }
  }, 2000);
}

async function _fetchStatus2(_temp) {
  let {
    diff = true
  } = _temp === void 0 ? {} : _temp;
  if (this.closed || _classPrivateFieldLooseBase(this, _rateLimitedQueue)[_rateLimitedQueue].isPaused || _classPrivateFieldLooseBase(this, _previousFetchStatusStillPending)[_previousFetchStatusStillPending]) return;

  try {
    _classPrivateFieldLooseBase(this, _previousFetchStatusStillPending)[_previousFetchStatusStillPending] = true;
    const response = await _classPrivateFieldLooseBase(this, _fetchWithNetworkError)[_fetchWithNetworkError](this.status.assembly_ssl_url);
    _classPrivateFieldLooseBase(this, _previousFetchStatusStillPending)[_previousFetchStatusStillPending] = false;
    if (this.closed) return;

    if (response.status === 429) {
      _classPrivateFieldLooseBase(this, _rateLimitedQueue)[_rateLimitedQueue].rateLimit(2000);

      return;
    }

    if (!response.ok) {
      _classPrivateFieldLooseBase(this, _onError)[_onError](new NetworkError(response.statusText));

      return;
    }

    const status = await response.json(); // Avoid updating if we closed during this request's lifetime.

    if (this.closed) return;
    this.emit('status', status);

    if (diff) {
      this.updateStatus(status);
    } else {
      this.status = status;
    }
  } catch (err) {
    _classPrivateFieldLooseBase(this, _onError)[_onError](err);
  }
}

function _diffStatus2(prev, next) {
  const prevStatus = prev.ok;
  const nextStatus = next.ok;

  if (next.error && !prev.error) {
    return _classPrivateFieldLooseBase(this, _onError)[_onError](next);
  } // Desired emit order:
  //  - executing
  //  - (n × upload)
  //  - metadata
  //  - (m × result)
  //  - finished
  // The below checks run in this order, that way even if we jump from
  // UPLOADING straight to FINISHED all the events are emitted as expected.


  const nowExecuting = isStatus(nextStatus, ASSEMBLY_EXECUTING) && !isStatus(prevStatus, ASSEMBLY_EXECUTING);

  if (nowExecuting) {
    // Without WebSockets, this is our only way to tell if uploading finished.
    // Hence, we emit this just before the 'upload's and before the 'metadata'
    // event for the most intuitive ordering, corresponding to the _usual_
    // ordering (if not guaranteed) that you'd get on the WebSocket.
    this.emit('executing');
  } // Find new uploaded files.


  Object.keys(next.uploads).filter(upload => !has(prev.uploads, upload)).forEach(upload => {
    this.emit('upload', next.uploads[upload]);
  });

  if (nowExecuting) {
    this.emit('metadata');
  } // Find new results.


  Object.keys(next.results).forEach(stepName => {
    const nextResults = next.results[stepName];
    const prevResults = prev.results[stepName];
    nextResults.filter(n => !prevResults || !prevResults.some(p => p.id === n.id)).forEach(result => {
      this.emit('result', stepName, result);
    });
  });

  if (isStatus(nextStatus, ASSEMBLY_COMPLETED) && !isStatus(prevStatus, ASSEMBLY_COMPLETED)) {
    this.emit('finished');
  }

  return undefined;
}

export default TransloaditAssembly;