let _Symbol$for;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

import { nanoid } from 'nanoid/non-secure';
const packageJson = {
  "version": "3.0.2"
}; // Redux action name.

export const STATE_UPDATE = 'uppy/STATE_UPDATE'; // Pluck Uppy state from the Redux store in the default location.

const defaultSelector = id => state => state.uppy[id];

function getPatch(prev, next) {
  const nextKeys = Object.keys(next);
  const patch = {};
  nextKeys.forEach(k => {
    if (prev[k] !== next[k]) patch[k] = next[k];
  });
  return patch;
}
/**
 * Redux store.
 *
 * @param {object} opts.store - The Redux store to use.
 * @param {string} opts.id - This store instance's ID. Defaults to a random string.
 *    If you need to access Uppy state through Redux, eg. to render custom UI, set this to something constant.
 * @param {Function} opts.selector - Function, `(state) => uppyState`, to pluck state from the Redux store.
 *    Defaults to retrieving `state.uppy[opts.id]`. Override if you placed Uppy state elsewhere in the Redux store.
 */


var _id = /*#__PURE__*/_classPrivateFieldLooseKey("id");

var _selector = /*#__PURE__*/_classPrivateFieldLooseKey("selector");

var _store = /*#__PURE__*/_classPrivateFieldLooseKey("store");

_Symbol$for = Symbol.for('uppy test: get id');
export class ReduxStore {
  constructor(opts) {
    Object.defineProperty(this, _id, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _selector, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _store, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldLooseBase(this, _store)[_store] = opts.store;
    _classPrivateFieldLooseBase(this, _id)[_id] = opts.id || nanoid();
    _classPrivateFieldLooseBase(this, _selector)[_selector] = opts.selector || defaultSelector(_classPrivateFieldLooseBase(this, _id)[_id]); // Calling `setState` to dispatch an action to the Redux store.
    // The intent is to make sure that the reducer has run once.

    this.setState({});
  }

  setState(patch) {
    _classPrivateFieldLooseBase(this, _store)[_store].dispatch({
      type: STATE_UPDATE,
      id: _classPrivateFieldLooseBase(this, _id)[_id],
      payload: patch
    });
  }

  getState() {
    return _classPrivateFieldLooseBase(this, _selector)[_selector](_classPrivateFieldLooseBase(this, _store)[_store].getState());
  }

  subscribe(cb) {
    let prevState = this.getState();
    return _classPrivateFieldLooseBase(this, _store)[_store].subscribe(() => {
      const nextState = this.getState();

      if (prevState !== nextState) {
        const patch = getPatch(prevState, nextState);
        cb(prevState, nextState, patch);
        prevState = nextState;
      }
    });
  }

  [_Symbol$for]() {
    return _classPrivateFieldLooseBase(this, _id)[_id];
  }

}
ReduxStore.VERSION = packageJson.version;
export function reducer(state, action) {
  if (state === void 0) {
    state = {};
  }

  if (action.type === STATE_UPDATE) {
    const newState = { ...state[action.id],
      ...action.payload
    };
    return { ...state,
      [action.id]: newState
    };
  }

  return state;
}
export function middleware() {
  // Do nothing, at the moment.
  return () => next => action => {
    next(action);
  };
}
export default ReduxStore;