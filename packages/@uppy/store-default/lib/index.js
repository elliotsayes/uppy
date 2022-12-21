function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const packageJson = {
  "version": "3.0.2"
};
/**
 * Default store that keeps state in a simple object.
 */

var _callbacks = /*#__PURE__*/_classPrivateFieldLooseKey("callbacks");

var _publish = /*#__PURE__*/_classPrivateFieldLooseKey("publish");

class DefaultStore {
  constructor() {
    Object.defineProperty(this, _publish, {
      value: _publish2
    });
    Object.defineProperty(this, _callbacks, {
      writable: true,
      value: new Set()
    });
    this.state = {};
  }

  getState() {
    return this.state;
  }

  setState(patch) {
    const prevState = { ...this.state
    };
    const nextState = { ...this.state,
      ...patch
    };
    this.state = nextState;

    _classPrivateFieldLooseBase(this, _publish)[_publish](prevState, nextState, patch);
  }

  subscribe(listener) {
    _classPrivateFieldLooseBase(this, _callbacks)[_callbacks].add(listener);

    return () => {
      _classPrivateFieldLooseBase(this, _callbacks)[_callbacks].delete(listener);
    };
  }

}

function _publish2() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  _classPrivateFieldLooseBase(this, _callbacks)[_callbacks].forEach(listener => {
    listener(...args);
  });
}

DefaultStore.VERSION = packageJson.version;
export default DefaultStore;