'use strict';

let _Symbol$for;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

import fetchWithNetworkError from '@uppy/utils/lib/fetchWithNetworkError';
import ErrorWithCause from '@uppy/utils/lib/ErrorWithCause';
import AuthError from './AuthError.js';
const packageJson = {
  "version": "3.1.1"
}; // Remove the trailing slash so we can always safely append /xyz.

function stripSlash(url) {
  return url.replace(/\/$/, '');
}

async function handleJSONResponse(res) {
  if (res.status === 401) {
    throw new AuthError();
  }

  const jsonPromise = res.json();

  if (res.ok) {
    return jsonPromise;
  }

  let errMsg = `Failed request with status: ${res.status}. ${res.statusText}`;

  try {
    const errData = await jsonPromise;
    errMsg = errData.message ? `${errMsg} message: ${errData.message}` : errMsg;
    errMsg = errData.requestId ? `${errMsg} request-Id: ${errData.requestId}` : errMsg;
  } catch {
    /* if the response contains invalid JSON, let's ignore the error */
  }

  throw new Error(errMsg);
} // todo pull out into core instead?


const allowedHeadersCache = new Map();

var _companionHeaders = /*#__PURE__*/_classPrivateFieldLooseKey("companionHeaders");

var _getUrl = /*#__PURE__*/_classPrivateFieldLooseKey("getUrl");

var _request = /*#__PURE__*/_classPrivateFieldLooseKey("request");

_Symbol$for = Symbol.for('uppy test: getCompanionHeaders');
export default class RequestClient {
  constructor(uppy, opts) {
    Object.defineProperty(this, _request, {
      value: _request2
    });
    Object.defineProperty(this, _getUrl, {
      value: _getUrl2
    });
    Object.defineProperty(this, _companionHeaders, {
      writable: true,
      value: void 0
    });
    this.uppy = uppy;
    this.opts = opts;
    this.onReceiveResponse = this.onReceiveResponse.bind(this);
    _classPrivateFieldLooseBase(this, _companionHeaders)[_companionHeaders] = opts == null ? void 0 : opts.companionHeaders;
  }

  setCompanionHeaders(headers) {
    _classPrivateFieldLooseBase(this, _companionHeaders)[_companionHeaders] = headers;
  }

  [_Symbol$for]() {
    return _classPrivateFieldLooseBase(this, _companionHeaders)[_companionHeaders];
  }

  get hostname() {
    const {
      companion
    } = this.uppy.getState();
    const host = this.opts.companionUrl;
    return stripSlash(companion && companion[host] ? companion[host] : host);
  }

  async headers() {
    const defaultHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Uppy-Versions': `@uppy/companion-client=${RequestClient.VERSION}`
    };
    return { ...defaultHeaders,
      ..._classPrivateFieldLooseBase(this, _companionHeaders)[_companionHeaders]
    };
  }

  onReceiveResponse(_ref) {
    let {
      headers
    } = _ref;
    const state = this.uppy.getState();
    const companion = state.companion || {};
    const host = this.opts.companionUrl; // Store the self-identified domain name for the Companion instance we just hit.

    if (headers.has('i-am') && headers.get('i-am') !== companion[host]) {
      this.uppy.setState({
        companion: { ...companion,
          [host]: headers.get('i-am')
        }
      });
    }
  }

  /*
    Preflight was added to avoid breaking change between older Companion-client versions and
    newer Companion versions and vice-versa. Usually the break will manifest via CORS errors because a
    version of companion-client could be sending certain headers to a version of Companion server that
    does not support those headers. In which case, the default preflight would lead to CORS.
    So to avoid those errors, we do preflight ourselves, to see what headers the Companion server
    we are communicating with allows. And based on that, companion-client knows what headers to
    send and what headers to not send.
     The preflight only happens once throughout the life-cycle of a certain
    Companion-client <-> Companion-server pair (allowedHeadersCache).
    Subsequent requests use the cached result of the preflight.
    However if there is an error retrieving the allowed headers, we will try again next time
  */
  async preflight(path) {
    const allowedHeadersCached = allowedHeadersCache.get(this.hostname);
    if (allowedHeadersCached != null) return allowedHeadersCached;
    const fallbackAllowedHeaders = ['accept', 'content-type', 'uppy-auth-token'];

    const promise = (async () => {
      try {
        const response = await fetch(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
          method: 'OPTIONS'
        });
        const header = response.headers.get('access-control-allow-headers');

        if (header == null || header === '*') {
          allowedHeadersCache.set(this.hostname, fallbackAllowedHeaders);
          return fallbackAllowedHeaders;
        }

        this.uppy.log(`[CompanionClient] adding allowed preflight headers to companion cache: ${this.hostname} ${header}`);
        const allowedHeaders = header.split(',').map(headerName => headerName.trim().toLowerCase());
        allowedHeadersCache.set(this.hostname, allowedHeaders);
        return allowedHeaders;
      } catch (err) {
        this.uppy.log(`[CompanionClient] unable to make preflight request ${err}`, 'warning'); // If the user gets a network error or similar, we should try preflight
        // again next time, or else we might get incorrect behaviour.

        allowedHeadersCache.delete(this.hostname); // re-fetch next time

        return fallbackAllowedHeaders;
      }
    })();

    allowedHeadersCache.set(this.hostname, promise);
    return promise;
  }

  async preflightAndHeaders(path) {
    const [allowedHeaders, headers] = await Promise.all([this.preflight(path), this.headers()]); // filter to keep only allowed Headers

    return Object.fromEntries(Object.entries(headers).filter(_ref2 => {
      let [header] = _ref2;

      if (!allowedHeaders.includes(header.toLowerCase())) {
        this.uppy.log(`[CompanionClient] excluding disallowed header ${header}`);
        return false;
      }

      return true;
    }));
  }

  async get(path, options) {
    if (options === void 0) {
      options = undefined;
    }

    // TODO: remove boolean support for options that was added for backward compatibility.
    // eslint-disable-next-line no-param-reassign
    if (typeof options === 'boolean') options = {
      skipPostResponse: options
    };
    return _classPrivateFieldLooseBase(this, _request)[_request]({ ...options,
      path
    });
  }

  async post(path, data, options) {
    if (options === void 0) {
      options = undefined;
    }

    // TODO: remove boolean support for options that was added for backward compatibility.
    // eslint-disable-next-line no-param-reassign
    if (typeof options === 'boolean') options = {
      skipPostResponse: options
    };
    return _classPrivateFieldLooseBase(this, _request)[_request]({ ...options,
      path,
      method: 'POST',
      data
    });
  }

  async delete(path, data, options) {
    if (data === void 0) {
      data = undefined;
    }

    // TODO: remove boolean support for options that was added for backward compatibility.
    // eslint-disable-next-line no-param-reassign
    if (typeof options === 'boolean') options = {
      skipPostResponse: options
    };
    return _classPrivateFieldLooseBase(this, _request)[_request]({ ...options,
      path,
      method: 'DELETE',
      data
    });
  }

}

function _getUrl2(url) {
  if (/^(https?:|)\/\//.test(url)) {
    return url;
  }

  return `${this.hostname}/${url}`;
}

async function _request2(_ref3) {
  let {
    path,
    method = 'GET',
    data,
    skipPostResponse,
    signal
  } = _ref3;

  try {
    const headers = await this.preflightAndHeaders(path);
    const response = await fetchWithNetworkError(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method,
      signal,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin',
      body: data ? JSON.stringify(data) : null
    });
    if (!skipPostResponse) this.onReceiveResponse(response);
    return handleJSONResponse(response);
  } catch (err) {
    if (err != null && err.isAuthError) throw err;
    throw new ErrorWithCause(`Could not ${method} ${_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path)}`, {
      cause: err
    });
  }
}

RequestClient.VERSION = packageJson.version;