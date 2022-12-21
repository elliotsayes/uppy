function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

import Emitter from 'component-emitter';
/**
 * Track completion of multiple assemblies.
 *
 * Emits 'assembly-complete' when an assembly completes.
 * Emits 'assembly-error' when an assembly fails.
 * Exposes a `.promise` property that resolves when all assemblies have
 * completed (or failed).
 */

var _assemblyIDs = /*#__PURE__*/_classPrivateFieldLooseKey("assemblyIDs");

var _reject = /*#__PURE__*/_classPrivateFieldLooseKey("reject");

var _remaining = /*#__PURE__*/_classPrivateFieldLooseKey("remaining");

var _resolve = /*#__PURE__*/_classPrivateFieldLooseKey("resolve");

var _uppy = /*#__PURE__*/_classPrivateFieldLooseKey("uppy");

var _watching = /*#__PURE__*/_classPrivateFieldLooseKey("watching");

var _onAssemblyComplete = /*#__PURE__*/_classPrivateFieldLooseKey("onAssemblyComplete");

var _onAssemblyCancel = /*#__PURE__*/_classPrivateFieldLooseKey("onAssemblyCancel");

var _onAssemblyError = /*#__PURE__*/_classPrivateFieldLooseKey("onAssemblyError");

var _onImportError = /*#__PURE__*/_classPrivateFieldLooseKey("onImportError");

var _checkAllComplete = /*#__PURE__*/_classPrivateFieldLooseKey("checkAllComplete");

var _removeListeners = /*#__PURE__*/_classPrivateFieldLooseKey("removeListeners");

var _addListeners = /*#__PURE__*/_classPrivateFieldLooseKey("addListeners");

class TransloaditAssemblyWatcher extends Emitter {
  constructor(uppy, assemblyIDs) {
    super();
    Object.defineProperty(this, _addListeners, {
      value: _addListeners2
    });
    Object.defineProperty(this, _removeListeners, {
      value: _removeListeners2
    });
    Object.defineProperty(this, _checkAllComplete, {
      value: _checkAllComplete2
    });
    Object.defineProperty(this, _watching, {
      value: _watching2
    });
    Object.defineProperty(this, _assemblyIDs, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _reject, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _remaining, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _resolve, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _uppy, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _onAssemblyComplete, {
      writable: true,
      value: assembly => {
        if (!_classPrivateFieldLooseBase(this, _watching)[_watching](assembly.assembly_id)) {
          return;
        }

        _classPrivateFieldLooseBase(this, _uppy)[_uppy].log(`[Transloadit] AssemblyWatcher: Got Assembly finish ${assembly.assembly_id}`);

        this.emit('assembly-complete', assembly.assembly_id);

        _classPrivateFieldLooseBase(this, _checkAllComplete)[_checkAllComplete]();
      }
    });
    Object.defineProperty(this, _onAssemblyCancel, {
      writable: true,
      value: assembly => {
        if (!_classPrivateFieldLooseBase(this, _watching)[_watching](assembly.assembly_id)) {
          return;
        }

        _classPrivateFieldLooseBase(this, _checkAllComplete)[_checkAllComplete]();
      }
    });
    Object.defineProperty(this, _onAssemblyError, {
      writable: true,
      value: (assembly, error) => {
        if (!_classPrivateFieldLooseBase(this, _watching)[_watching](assembly.assembly_id)) {
          return;
        }

        _classPrivateFieldLooseBase(this, _uppy)[_uppy].log(`[Transloadit] AssemblyWatcher: Got Assembly error ${assembly.assembly_id}`);

        _classPrivateFieldLooseBase(this, _uppy)[_uppy].log(error);

        this.emit('assembly-error', assembly.assembly_id, error);

        _classPrivateFieldLooseBase(this, _checkAllComplete)[_checkAllComplete]();
      }
    });
    Object.defineProperty(this, _onImportError, {
      writable: true,
      value: (assembly, fileID, error) => {
        if (!_classPrivateFieldLooseBase(this, _watching)[_watching](assembly.assembly_id)) {
          return;
        } // Not sure if we should be doing something when it's just one file failing.
        // ATM, the only options are 1) ignoring or 2) failing the entire upload.
        // I think failing the upload is better than silently ignoring.
        // In the future we should maybe have a way to resolve uploads with some failures,
        // like returning an object with `{ successful, failed }` uploads.


        _classPrivateFieldLooseBase(this, _onAssemblyError)[_onAssemblyError](assembly, error);
      }
    });
    _classPrivateFieldLooseBase(this, _uppy)[_uppy] = uppy;
    _classPrivateFieldLooseBase(this, _assemblyIDs)[_assemblyIDs] = assemblyIDs;
    _classPrivateFieldLooseBase(this, _remaining)[_remaining] = assemblyIDs.length;
    this.promise = new Promise((resolve, reject) => {
      _classPrivateFieldLooseBase(this, _resolve)[_resolve] = resolve;
      _classPrivateFieldLooseBase(this, _reject)[_reject] = reject;
    });

    _classPrivateFieldLooseBase(this, _addListeners)[_addListeners]();
  }
  /**
   * Are we watching this assembly ID?
   */


}

function _watching2(id) {
  return _classPrivateFieldLooseBase(this, _assemblyIDs)[_assemblyIDs].indexOf(id) !== -1;
}

function _checkAllComplete2() {
  _classPrivateFieldLooseBase(this, _remaining)[_remaining] -= 1;

  if (_classPrivateFieldLooseBase(this, _remaining)[_remaining] === 0) {
    // We're done, these listeners can be removed
    _classPrivateFieldLooseBase(this, _removeListeners)[_removeListeners]();

    _classPrivateFieldLooseBase(this, _resolve)[_resolve]();
  }
}

function _removeListeners2() {
  _classPrivateFieldLooseBase(this, _uppy)[_uppy].off('transloadit:complete', _classPrivateFieldLooseBase(this, _onAssemblyComplete)[_onAssemblyComplete]);

  _classPrivateFieldLooseBase(this, _uppy)[_uppy].off('transloadit:assembly-cancel', _classPrivateFieldLooseBase(this, _onAssemblyCancel)[_onAssemblyCancel]);

  _classPrivateFieldLooseBase(this, _uppy)[_uppy].off('transloadit:assembly-error', _classPrivateFieldLooseBase(this, _onAssemblyError)[_onAssemblyError]);

  _classPrivateFieldLooseBase(this, _uppy)[_uppy].off('transloadit:import-error', _classPrivateFieldLooseBase(this, _onImportError)[_onImportError]);
}

function _addListeners2() {
  _classPrivateFieldLooseBase(this, _uppy)[_uppy].on('transloadit:complete', _classPrivateFieldLooseBase(this, _onAssemblyComplete)[_onAssemblyComplete]);

  _classPrivateFieldLooseBase(this, _uppy)[_uppy].on('transloadit:assembly-cancel', _classPrivateFieldLooseBase(this, _onAssemblyCancel)[_onAssemblyCancel]);

  _classPrivateFieldLooseBase(this, _uppy)[_uppy].on('transloadit:assembly-error', _classPrivateFieldLooseBase(this, _onAssemblyError)[_onAssemblyError]);

  _classPrivateFieldLooseBase(this, _uppy)[_uppy].on('transloadit:import-error', _classPrivateFieldLooseBase(this, _onImportError)[_onImportError]);
}

export default TransloaditAssemblyWatcher;