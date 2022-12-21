function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

import hasProperty from '@uppy/utils/lib/hasProperty';
import ErrorWithCause from '@uppy/utils/lib/ErrorWithCause';
import { RateLimitedQueue } from '@uppy/utils/lib/RateLimitedQueue';
import BasePlugin from '@uppy/core/lib/BasePlugin.js';
import Tus from '@uppy/tus';
import Assembly from './Assembly.js';
import Client from './Client.js';
import AssemblyOptions, { validateParams } from './AssemblyOptions.js';
import AssemblyWatcher from './AssemblyWatcher.js';
import locale from './locale.js';
const packageJson = {
  "version": "3.0.2"
};

function defaultGetAssemblyOptions(file, options) {
  return {
    params: options.params,
    signature: options.signature,
    fields: options.fields
  };
}

const sendErrorToConsole = originalErr => err => {
  const error = new ErrorWithCause('Failed to send error to the client', {
    cause: err
  }); // eslint-disable-next-line no-console

  console.error(error, originalErr);
};

const COMPANION_URL = 'https://api2.transloadit.com/companion'; // Regex matching acceptable postMessage() origins for authentication feedback from companion.

const COMPANION_ALLOWED_HOSTS = /\.transloadit\.com$/; // Regex used to check if a Companion address is run by Transloadit.

const TL_COMPANION = /https?:\/\/api2(?:-\w+)?\.transloadit\.com\/companion/;
/**
 * Upload files to Transloadit using Tus.
 */

var _rateLimitedQueue = /*#__PURE__*/_classPrivateFieldLooseKey("rateLimitedQueue");

var _getClientVersion = /*#__PURE__*/_classPrivateFieldLooseKey("getClientVersion");

var _attachAssemblyMetadata = /*#__PURE__*/_classPrivateFieldLooseKey("attachAssemblyMetadata");

var _createAssembly = /*#__PURE__*/_classPrivateFieldLooseKey("createAssembly");

var _createAssemblyWatcher = /*#__PURE__*/_classPrivateFieldLooseKey("createAssemblyWatcher");

var _shouldWaitAfterUpload = /*#__PURE__*/_classPrivateFieldLooseKey("shouldWaitAfterUpload");

var _reserveFiles = /*#__PURE__*/_classPrivateFieldLooseKey("reserveFiles");

var _onFileUploadURLAvailable = /*#__PURE__*/_classPrivateFieldLooseKey("onFileUploadURLAvailable");

var _findFile = /*#__PURE__*/_classPrivateFieldLooseKey("findFile");

var _onFileUploadComplete = /*#__PURE__*/_classPrivateFieldLooseKey("onFileUploadComplete");

var _onResult = /*#__PURE__*/_classPrivateFieldLooseKey("onResult");

var _onAssemblyFinished = /*#__PURE__*/_classPrivateFieldLooseKey("onAssemblyFinished");

var _cancelAssembly = /*#__PURE__*/_classPrivateFieldLooseKey("cancelAssembly");

var _onCancelAll = /*#__PURE__*/_classPrivateFieldLooseKey("onCancelAll");

var _getPersistentData = /*#__PURE__*/_classPrivateFieldLooseKey("getPersistentData");

var _onRestored = /*#__PURE__*/_classPrivateFieldLooseKey("onRestored");

var _connectAssembly = /*#__PURE__*/_classPrivateFieldLooseKey("connectAssembly");

var _prepareUpload = /*#__PURE__*/_classPrivateFieldLooseKey("prepareUpload");

var _afterUpload = /*#__PURE__*/_classPrivateFieldLooseKey("afterUpload");

var _closeAssemblyIfExists = /*#__PURE__*/_classPrivateFieldLooseKey("closeAssemblyIfExists");

var _onError = /*#__PURE__*/_classPrivateFieldLooseKey("onError");

var _onTusError = /*#__PURE__*/_classPrivateFieldLooseKey("onTusError");

export default class Transloadit extends BasePlugin {
  /** @deprecated use `import { COMPANION_URL } from '@uppy/transloadit'` instead. */

  /** @deprecated use `import { COMPANION_ALLOWED_HOSTS } from '@uppy/transloadit'` instead. */
  constructor(uppy, opts) {
    var _this, _opts$assemblyOptions;

    super(uppy, opts);
    _this = this;
    Object.defineProperty(this, _connectAssembly, {
      value: _connectAssembly2
    });
    Object.defineProperty(this, _cancelAssembly, {
      value: _cancelAssembly2
    });
    Object.defineProperty(this, _onAssemblyFinished, {
      value: _onAssemblyFinished2
    });
    Object.defineProperty(this, _onResult, {
      value: _onResult2
    });
    Object.defineProperty(this, _onFileUploadComplete, {
      value: _onFileUploadComplete2
    });
    Object.defineProperty(this, _findFile, {
      value: _findFile2
    });
    Object.defineProperty(this, _reserveFiles, {
      value: _reserveFiles2
    });
    Object.defineProperty(this, _shouldWaitAfterUpload, {
      value: _shouldWaitAfterUpload2
    });
    Object.defineProperty(this, _createAssemblyWatcher, {
      value: _createAssemblyWatcher2
    });
    Object.defineProperty(this, _createAssembly, {
      value: _createAssembly2
    });
    Object.defineProperty(this, _attachAssemblyMetadata, {
      value: _attachAssemblyMetadata2
    });
    Object.defineProperty(this, _getClientVersion, {
      value: _getClientVersion2
    });
    Object.defineProperty(this, _rateLimitedQueue, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _onFileUploadURLAvailable, {
      writable: true,
      value: rawFile => {
        var _file$transloadit;

        const file = this.uppy.getFile(rawFile.id);

        if (!(file != null && (_file$transloadit = file.transloadit) != null && _file$transloadit.assembly)) {
          return;
        }

        const {
          assemblies
        } = this.getPluginState();
        const assembly = assemblies[file.transloadit.assembly];
        this.client.addFile(assembly, file).catch(err => {
          this.uppy.log(err);
          this.uppy.emit('transloadit:import-error', assembly, file.id, err);
        });
      }
    });
    Object.defineProperty(this, _onCancelAll, {
      writable: true,
      value: async function (_temp) {
        let {
          reason
        } = _temp === void 0 ? {} : _temp;

        try {
          if (reason !== 'user') return;

          const {
            uploadsAssemblies
          } = _this.getPluginState();

          const assemblyIDs = Object.values(uploadsAssemblies).flat(1);
          const assemblies = assemblyIDs.map(assemblyID => _this.getAssembly(assemblyID));
          await Promise.all(assemblies.map(assembly => _classPrivateFieldLooseBase(_this, _cancelAssembly)[_cancelAssembly](assembly)));
        } catch (err) {
          _this.uppy.log(err);
        }
      }
    });
    Object.defineProperty(this, _getPersistentData, {
      writable: true,
      value: setData => {
        const {
          assemblies,
          uploadsAssemblies
        } = this.getPluginState();
        setData({
          [this.id]: {
            assemblies,
            uploadsAssemblies
          }
        });
      }
    });
    Object.defineProperty(this, _onRestored, {
      writable: true,
      value: pluginData => {
        const savedState = pluginData && pluginData[this.id] ? pluginData[this.id] : {};
        const previousAssemblies = savedState.assemblies || {};
        const uploadsAssemblies = savedState.uploadsAssemblies || {};

        if (Object.keys(uploadsAssemblies).length === 0) {
          // Nothing to restore.
          return;
        } // Convert loaded Assembly statuses to a Transloadit plugin state object.


        const restoreState = assemblies => {
          const files = {};
          const results = [];

          for (const [id, status] of Object.entries(assemblies)) {
            status.uploads.forEach(uploadedFile => {
              const file = _classPrivateFieldLooseBase(this, _findFile)[_findFile](uploadedFile);

              files[uploadedFile.id] = {
                id: file.id,
                assembly: id,
                uploadedFile
              };
            });
            const state = this.getPluginState();
            Object.keys(status.results).forEach(stepName => {
              for (const result of status.results[stepName]) {
                const file = state.files[result.original_id];
                result.localId = file ? file.id : null;
                results.push({
                  id: result.id,
                  result,
                  stepName,
                  assembly: id
                });
              }
            });
          }

          this.setPluginState({
            assemblies,
            files,
            results,
            uploadsAssemblies
          });
        }; // Set up the Assembly instances and AssemblyWatchers for existing Assemblies.


        const restoreAssemblies = () => {
          // eslint-disable-next-line no-shadow
          const {
            assemblies,
            uploadsAssemblies
          } = this.getPluginState(); // Set up the assembly watchers again for all the ongoing uploads.

          Object.keys(uploadsAssemblies).forEach(uploadID => {
            const assemblyIDs = uploadsAssemblies[uploadID];

            _classPrivateFieldLooseBase(this, _createAssemblyWatcher)[_createAssemblyWatcher](assemblyIDs, uploadID);
          });
          const allAssemblyIDs = Object.keys(assemblies);
          allAssemblyIDs.forEach(id => {
            const assembly = new Assembly(assemblies[id], _classPrivateFieldLooseBase(this, _rateLimitedQueue)[_rateLimitedQueue]);

            _classPrivateFieldLooseBase(this, _connectAssembly)[_connectAssembly](assembly);
          });
        }; // Force-update all Assemblies to check for missed events.


        const updateAssemblies = () => {
          const {
            assemblies
          } = this.getPluginState();
          return Promise.all(Object.keys(assemblies).map(id => {
            return this.activeAssemblies[id].update();
          }));
        }; // Restore all Assembly state.


        this.restored = Promise.resolve().then(() => {
          restoreState(previousAssemblies);
          restoreAssemblies();
          return updateAssemblies();
        });
        this.restored.then(() => {
          this.restored = null;
        });
      }
    });
    Object.defineProperty(this, _prepareUpload, {
      writable: true,
      value: (fileIDs, uploadID) => {
        const files = fileIDs.map(id => this.uppy.getFile(id));
        const filesWithoutErrors = files.filter(file => {
          if (!file.error) {
            this.uppy.emit('preprocess-progress', file, {
              mode: 'indeterminate',
              message: this.i18n('creatingAssembly')
            });
            return true;
          }

          return false;
        }); // eslint-disable-next-line no-shadow

        const createAssembly = async _ref => {
          let {
            fileIDs,
            options
          } = _ref;

          try {
            const assembly = await _classPrivateFieldLooseBase(this, _createAssembly)[_createAssembly](fileIDs, uploadID, options);

            if (this.opts.importFromUploadURLs) {
              await _classPrivateFieldLooseBase(this, _reserveFiles)[_reserveFiles](assembly, fileIDs);
            }

            fileIDs.forEach(fileID => {
              const file = this.uppy.getFile(fileID);
              this.uppy.emit('preprocess-complete', file);
            });
            return assembly;
          } catch (err) {
            fileIDs.forEach(fileID => {
              const file = this.uppy.getFile(fileID); // Clear preprocessing state when the Assembly could not be created,
              // otherwise the UI gets confused about the lingering progress keys

              this.uppy.emit('preprocess-complete', file);
              this.uppy.emit('upload-error', file, err);
            });
            throw err;
          }
        };

        const {
          uploadsAssemblies
        } = this.getPluginState();
        this.setPluginState({
          uploadsAssemblies: { ...uploadsAssemblies,
            [uploadID]: []
          }
        });
        const assemblyOptions = new AssemblyOptions(filesWithoutErrors, this.opts);
        return assemblyOptions.build().then(assemblies => Promise.all(assemblies.map(createAssembly))).then(maybeCreatedAssemblies => {
          const createdAssemblies = maybeCreatedAssemblies.filter(Boolean);
          const assemblyIDs = createdAssemblies.map(assembly => assembly.status.assembly_id);

          _classPrivateFieldLooseBase(this, _createAssemblyWatcher)[_createAssemblyWatcher](assemblyIDs, uploadID);

          return Promise.all(createdAssemblies.map(assembly => _classPrivateFieldLooseBase(this, _connectAssembly)[_connectAssembly](assembly)));
        }) // If something went wrong before any Assemblies could be created,
        // clear all processing state.
        .catch(err => {
          filesWithoutErrors.forEach(file => {
            this.uppy.emit('preprocess-complete', file);
            this.uppy.emit('upload-error', file, err);
          });
          throw err;
        });
      }
    });
    Object.defineProperty(this, _afterUpload, {
      writable: true,
      value: (fileIDs, uploadID) => {
        const files = fileIDs.map(fileID => this.uppy.getFile(fileID)); // Only use files without errors

        const filteredFileIDs = files.filter(file => !file.error).map(file => file.id);
        const state = this.getPluginState(); // If we're still restoring state, wait for that to be done.

        if (this.restored) {
          return this.restored.then(() => {
            return _classPrivateFieldLooseBase(this, _afterUpload)[_afterUpload](filteredFileIDs, uploadID);
          });
        }

        const assemblyIDs = state.uploadsAssemblies[uploadID];

        const closeSocketConnections = () => {
          assemblyIDs.forEach(assemblyID => {
            const assembly = this.activeAssemblies[assemblyID];
            assembly.close();
            delete this.activeAssemblies[assemblyID];
          });
        }; // If we don't have to wait for encoding metadata or results, we can close
        // the socket immediately and finish the upload.


        if (!_classPrivateFieldLooseBase(this, _shouldWaitAfterUpload)[_shouldWaitAfterUpload]()) {
          closeSocketConnections();
          const assemblies = assemblyIDs.map(id => this.getAssembly(id));
          this.uppy.addResultData(uploadID, {
            transloadit: assemblies
          });
          return Promise.resolve();
        } // If no Assemblies were created for this upload, we also do not have to wait.
        // There's also no sockets or anything to close, so just return immediately.


        if (assemblyIDs.length === 0) {
          this.uppy.addResultData(uploadID, {
            transloadit: []
          });
          return Promise.resolve();
        }

        const incompleteFiles = files.filter(file => !hasProperty(this.completedFiles, file.id));
        incompleteFiles.forEach(file => {
          this.uppy.emit('postprocess-progress', file, {
            mode: 'indeterminate',
            message: this.i18n('encoding')
          });
        });
        const watcher = this.assemblyWatchers[uploadID];
        return watcher.promise.then(() => {
          closeSocketConnections();
          const assemblies = assemblyIDs.map(id => this.getAssembly(id)); // Remove the Assembly ID list for this upload,
          // it's no longer going to be used anywhere.

          const uploadsAssemblies = { ...this.getPluginState().uploadsAssemblies
          };
          delete uploadsAssemblies[uploadID];
          this.setPluginState({
            uploadsAssemblies
          });
          this.uppy.addResultData(uploadID, {
            transloadit: assemblies
          });
        });
      }
    });
    Object.defineProperty(this, _closeAssemblyIfExists, {
      writable: true,
      value: assemblyID => {
        var _this$activeAssemblie;

        (_this$activeAssemblie = this.activeAssemblies[assemblyID]) == null ? void 0 : _this$activeAssemblie.close();
      }
    });
    Object.defineProperty(this, _onError, {
      writable: true,
      value: function (err, uploadID) {
        if (err === void 0) {
          err = null;
        }

        const state = _this.getPluginState();

        const assemblyIDs = state.uploadsAssemblies[uploadID];
        assemblyIDs == null ? void 0 : assemblyIDs.forEach(_classPrivateFieldLooseBase(_this, _closeAssemblyIfExists)[_closeAssemblyIfExists]);

        _this.client.submitError(err) // if we can't report the error that sucks
        .catch(sendErrorToConsole(err));
      }
    });
    Object.defineProperty(this, _onTusError, {
      writable: true,
      value: (file, err) => {
        var _file$transloadit2, _err$message;

        _classPrivateFieldLooseBase(this, _closeAssemblyIfExists)[_closeAssemblyIfExists](file == null ? void 0 : (_file$transloadit2 = file.transloadit) == null ? void 0 : _file$transloadit2.assembly);

        if (err != null && (_err$message = err.message) != null && _err$message.startsWith('tus: ')) {
          var _err$originalRequest, _err$originalRequest$;

          const endpoint = (_err$originalRequest = err.originalRequest) == null ? void 0 : (_err$originalRequest$ = _err$originalRequest.getUnderlyingObject()) == null ? void 0 : _err$originalRequest$.responseURL;
          this.client.submitError(err, {
            endpoint,
            type: 'TUS_ERROR'
          }) // if we can't report the error that sucks
          .catch(sendErrorToConsole(err));
        }
      }
    });
    this.type = 'uploader';
    this.id = this.opts.id || 'Transloadit';
    this.title = 'Transloadit';
    this.defaultLocale = locale;
    const defaultOptions = {
      service: 'https://api2.transloadit.com',
      errorReporting: true,
      waitForEncoding: false,
      waitForMetadata: false,
      alwaysRunAssembly: false,
      importFromUploadURLs: false,

      /** @deprecated use `assemblyOptions` instead */
      signature: null,

      /** @deprecated use `assemblyOptions` instead */
      params: null,

      /** @deprecated use `assemblyOptions` instead */
      fields: {},

      /** @deprecated use `assemblyOptions` instead */
      getAssemblyOptions: defaultGetAssemblyOptions,
      limit: 20,
      retryDelays: [7000, 10000, 15000, 20000]
    };
    this.opts = { ...defaultOptions,
      ...opts
    }; // TODO: move this into `defaultOptions` once we remove the deprecated options

    this.opts.assemblyOptions = (_opts$assemblyOptions = opts.assemblyOptions) != null ? _opts$assemblyOptions : this.opts.getAssemblyOptions;
    _classPrivateFieldLooseBase(this, _rateLimitedQueue)[_rateLimitedQueue] = new RateLimitedQueue(this.opts.limit);
    this.i18nInit();
    const hasCustomAssemblyOptions = this.opts.assemblyOptions !== defaultOptions.assemblyOptions;

    if (this.opts.params) {
      validateParams(this.opts.params);
    } else if (!hasCustomAssemblyOptions) {
      // Throw the same error that we'd throw if the `params` returned from a
      // `getAssemblyOptions()` function is null.
      validateParams(null);
    }

    this.client = new Client({
      service: this.opts.service,
      client: _classPrivateFieldLooseBase(this, _getClientVersion)[_getClientVersion](),
      errorReporting: this.opts.errorReporting,
      rateLimitedQueue: _classPrivateFieldLooseBase(this, _rateLimitedQueue)[_rateLimitedQueue]
    }); // Contains Assembly instances for in-progress Assemblies.

    this.activeAssemblies = {}; // Contains a mapping of uploadID to AssemblyWatcher

    this.assemblyWatchers = {}; // Contains a file IDs that have completed postprocessing before the upload
    // they belong to has entered the postprocess stage.

    this.completedFiles = Object.create(null);
  }

  install() {
    this.uppy.addPreProcessor(_classPrivateFieldLooseBase(this, _prepareUpload)[_prepareUpload]);
    this.uppy.addPostProcessor(_classPrivateFieldLooseBase(this, _afterUpload)[_afterUpload]); // We may need to close socket.io connections on error.

    this.uppy.on('error', _classPrivateFieldLooseBase(this, _onError)[_onError]); // Handle cancellation.

    this.uppy.on('cancel-all', _classPrivateFieldLooseBase(this, _onCancelAll)[_onCancelAll]); // For error reporting.

    this.uppy.on('upload-error', _classPrivateFieldLooseBase(this, _onTusError)[_onTusError]);

    if (this.opts.importFromUploadURLs) {
      // No uploader needed when importing; instead we take the upload URL from an existing uploader.
      this.uppy.on('upload-success', _classPrivateFieldLooseBase(this, _onFileUploadURLAvailable)[_onFileUploadURLAvailable]);
    } else {
      this.uppy.use(Tus, {
        // Disable tus-js-client fingerprinting, otherwise uploading the same file at different times
        // will upload to an outdated Assembly, and we won't get socket events for it.
        //
        // To resume a Transloadit upload, we need to reconnect to the websocket, and the state that's
        // required to do that is not saved by tus-js-client's fingerprinting. We need the tus URL,
        // the Assembly URL, and the WebSocket URL, at least. We also need to know _all_ the files that
        // were added to the Assembly, so we can properly complete it. All that state is handled by
        // Golden Retriever. So, Golden Retriever is required to do resumability with the Transloadit plugin,
        // and we disable Tus's default resume implementation to prevent bad behaviours.
        storeFingerprintForResuming: false,
        // Disable Companion's retry optimisation; we need to change the endpoint on retry
        // so it can't just reuse the same tus.Upload instance server-side.
        useFastRemoteRetry: false,
        // Only send Assembly metadata to the tus endpoint.
        allowedMetaFields: ['assembly_url', 'filename', 'fieldname'],
        // Pass the limit option to @uppy/tus
        limit: this.opts.limit,
        rateLimitedQueue: _classPrivateFieldLooseBase(this, _rateLimitedQueue)[_rateLimitedQueue],
        retryDelays: this.opts.retryDelays
      });
    }

    this.uppy.on('restore:get-data', _classPrivateFieldLooseBase(this, _getPersistentData)[_getPersistentData]);
    this.uppy.on('restored', _classPrivateFieldLooseBase(this, _onRestored)[_onRestored]);
    this.setPluginState({
      // Contains Assembly status objects, indexed by their ID.
      assemblies: {},
      // Contains arrays of Assembly IDs, indexed by the upload ID that they belong to.
      uploadsAssemblies: {},
      // Contains file data from Transloadit, indexed by their Transloadit-assigned ID.
      files: {},
      // Contains result data from Transloadit.
      results: []
    }); // We cannot cancel individual files because Assemblies tend to contain many files.

    const {
      capabilities
    } = this.uppy.getState();
    this.uppy.setState({
      capabilities: { ...capabilities,
        individualCancellation: false
      }
    });
  }

  uninstall() {
    this.uppy.removePreProcessor(_classPrivateFieldLooseBase(this, _prepareUpload)[_prepareUpload]);
    this.uppy.removePostProcessor(_classPrivateFieldLooseBase(this, _afterUpload)[_afterUpload]);
    this.uppy.off('error', _classPrivateFieldLooseBase(this, _onError)[_onError]);

    if (this.opts.importFromUploadURLs) {
      this.uppy.off('upload-success', _classPrivateFieldLooseBase(this, _onFileUploadURLAvailable)[_onFileUploadURLAvailable]);
    }

    const {
      capabilities
    } = this.uppy.getState();
    this.uppy.setState({
      capabilities: { ...capabilities,
        individualCancellation: true
      }
    });
  }

  getAssembly(id) {
    const {
      assemblies
    } = this.getPluginState();
    return assemblies[id];
  }

  getAssemblyFiles(assemblyID) {
    return this.uppy.getFiles().filter(file => {
      var _file$transloadit3;

      return (file == null ? void 0 : (_file$transloadit3 = file.transloadit) == null ? void 0 : _file$transloadit3.assembly) === assemblyID;
    });
  }

}

function _getClientVersion2() {
  const list = [`uppy-core:${this.uppy.constructor.VERSION}`, `uppy-transloadit:${this.constructor.VERSION}`, `uppy-tus:${Tus.VERSION}`];

  const addPluginVersion = (pluginName, versionName) => {
    const plugin = this.uppy.getPlugin(pluginName);

    if (plugin) {
      list.push(`${versionName}:${plugin.constructor.VERSION}`);
    }
  };

  if (this.opts.importFromUploadURLs) {
    addPluginVersion('XHRUpload', 'uppy-xhr-upload');
    addPluginVersion('AwsS3', 'uppy-aws-s3');
    addPluginVersion('AwsS3Multipart', 'uppy-aws-s3-multipart');
  }

  addPluginVersion('Dropbox', 'uppy-dropbox');
  addPluginVersion('Box', 'uppy-box');
  addPluginVersion('Facebook', 'uppy-facebook');
  addPluginVersion('GoogleDrive', 'uppy-google-drive');
  addPluginVersion('Instagram', 'uppy-instagram');
  addPluginVersion('OneDrive', 'uppy-onedrive');
  addPluginVersion('Zoom', 'uppy-zoom');
  addPluginVersion('Url', 'uppy-url');
  return list.join(',');
}

function _attachAssemblyMetadata2(file, status) {
  // Add the metadata parameters Transloadit needs.
  const meta = { ...file.meta,
    assembly_url: status.assembly_url,
    filename: file.name,
    fieldname: 'file'
  }; // Add Assembly-specific Tus endpoint.

  const tus = { ...file.tus,
    endpoint: status.tus_url,
    // Include X-Request-ID headers for better debugging.
    addRequestId: true
  }; // Set Companion location. We only add this, if 'file' has the attribute
  // remote, because this is the criteria to identify remote files.
  // We only replace the hostname for Transloadit's companions, so that
  // people can also self-host them while still using Transloadit for encoding.

  let {
    remote
  } = file;

  if (file.remote && TL_COMPANION.test(file.remote.companionUrl)) {
    const newHost = status.companion_url.replace(/\/$/, '');
    const path = file.remote.url.replace(file.remote.companionUrl, '').replace(/^\//, '');
    remote = { ...file.remote,
      companionUrl: newHost,
      url: `${newHost}/${path}`
    };
  } // Store the Assembly ID this file is in on the file under the `transloadit` key.


  const newFile = { ...file,
    transloadit: {
      assembly: status.assembly_id
    }
  }; // Only configure the Tus plugin if we are uploading straight to Transloadit (the default).

  if (!this.opts.importFromUploadURLs) {
    Object.assign(newFile, {
      meta,
      tus,
      remote
    });
  }

  return newFile;
}

function _createAssembly2(fileIDs, uploadID, options) {
  this.uppy.log('[Transloadit] Create Assembly');
  return this.client.createAssembly({
    params: options.params,
    fields: options.fields,
    expectedFiles: fileIDs.length,
    signature: options.signature
  }).then(async newAssembly => {
    const files = this.uppy.getFiles().filter(_ref2 => {
      let {
        id
      } = _ref2;
      return fileIDs.includes(id);
    });

    if (files.length !== fileIDs.length) {
      if (files.length === 0) {
        // All files have been removed, cancelling.
        await this.client.cancelAssembly(newAssembly);
        return null;
      } // At least one file has been removed.


      await this.client.updateNumberOfFilesInAssembly(newAssembly, files.length);
    }

    const assembly = new Assembly(newAssembly, _classPrivateFieldLooseBase(this, _rateLimitedQueue)[_rateLimitedQueue]);
    const {
      status
    } = assembly;
    const assemblyID = status.assembly_id;
    const {
      assemblies,
      uploadsAssemblies
    } = this.getPluginState();
    this.setPluginState({
      // Store the Assembly status.
      assemblies: { ...assemblies,
        [assemblyID]: status
      },
      // Store the list of Assemblies related to this upload.
      uploadsAssemblies: { ...uploadsAssemblies,
        [uploadID]: [...uploadsAssemblies[uploadID], assemblyID]
      }
    });
    const updatedFiles = {};
    files.forEach(file => {
      updatedFiles[file.id] = _classPrivateFieldLooseBase(this, _attachAssemblyMetadata)[_attachAssemblyMetadata](file, status);
    });
    this.uppy.setState({
      files: { ...this.uppy.getState().files,
        ...updatedFiles
      }
    });

    const fileRemovedHandler = (fileRemoved, reason) => {
      if (reason === 'cancel-all') {
        assembly.close();
        this.uppy.off(fileRemovedHandler);
      } else if (fileRemoved.id in updatedFiles) {
        delete updatedFiles[fileRemoved.id];
        const nbOfRemainingFiles = Object.keys(updatedFiles).length;

        if (nbOfRemainingFiles === 0) {
          assembly.close();

          _classPrivateFieldLooseBase(this, _cancelAssembly)[_cancelAssembly](newAssembly).catch(() => {
            /* ignore potential errors */
          });

          this.uppy.off(fileRemovedHandler);
        } else {
          this.client.updateNumberOfFilesInAssembly(newAssembly, nbOfRemainingFiles).catch(() => {
            /* ignore potential errors */
          });
        }
      }
    };

    this.uppy.on('file-removed', fileRemovedHandler);
    this.uppy.emit('transloadit:assembly-created', status, fileIDs);
    this.uppy.log(`[Transloadit] Created Assembly ${assemblyID}`);
    return assembly;
  }).catch(err => {
    const wrapped = new ErrorWithCause(`${this.i18n('creatingAssemblyFailed')}: ${err.message}`, {
      cause: err
    });

    if ('details' in err) {
      wrapped.details = err.details;
    }

    if ('assembly' in err) {
      wrapped.assembly = err.assembly;
    }

    throw wrapped;
  });
}

function _createAssemblyWatcher2(assemblyID, uploadID) {
  // AssemblyWatcher tracks completion states of all Assemblies in this upload.
  const watcher = new AssemblyWatcher(this.uppy, assemblyID);
  watcher.on('assembly-complete', id => {
    const files = this.getAssemblyFiles(id);
    files.forEach(file => {
      this.completedFiles[file.id] = true;
      this.uppy.emit('postprocess-complete', file);
    });
  });
  watcher.on('assembly-error', (id, error) => {
    // Clear postprocessing state for all our files.
    const files = this.getAssemblyFiles(id);
    files.forEach(file => {
      // TODO Maybe make a postprocess-error event here?
      this.uppy.emit('upload-error', file, error);
      this.uppy.emit('postprocess-complete', file);
    });
  });
  this.assemblyWatchers[uploadID] = watcher;
}

function _shouldWaitAfterUpload2() {
  return this.opts.waitForEncoding || this.opts.waitForMetadata;
}

function _reserveFiles2(assembly, fileIDs) {
  return Promise.all(fileIDs.map(fileID => {
    const file = this.uppy.getFile(fileID);
    return this.client.reserveFile(assembly.status, file);
  }));
}

function _findFile2(uploadedFile) {
  const files = this.uppy.getFiles();

  for (let i = 0; i < files.length; i++) {
    const file = files[i]; // Completed file upload.

    if (file.uploadURL === uploadedFile.tus_upload_url) {
      return file;
    } // In-progress file upload.


    if (file.tus && file.tus.uploadUrl === uploadedFile.tus_upload_url) {
      return file;
    }

    if (!uploadedFile.is_tus_file) {
      // Fingers-crossed check for non-tus uploads, eg imported from S3.
      if (file.name === uploadedFile.name && file.size === uploadedFile.size) {
        return file;
      }
    }
  }

  return undefined;
}

function _onFileUploadComplete2(assemblyId, uploadedFile) {
  const state = this.getPluginState();

  const file = _classPrivateFieldLooseBase(this, _findFile)[_findFile](uploadedFile);

  if (!file) {
    this.uppy.log('[Transloadit] Couldn’t file the file, it was likely removed in the process');
    return;
  }

  this.setPluginState({
    files: { ...state.files,
      [uploadedFile.id]: {
        assembly: assemblyId,
        id: file.id,
        uploadedFile
      }
    }
  });
  this.uppy.emit('transloadit:upload', uploadedFile, this.getAssembly(assemblyId));
}

function _onResult2(assemblyId, stepName, result) {
  const state = this.getPluginState();
  const file = state.files[result.original_id]; // The `file` may not exist if an import robot was used instead of a file upload.

  result.localId = file ? file.id : null; // eslint-disable-line no-param-reassign

  const entry = {
    result,
    stepName,
    id: result.id,
    assembly: assemblyId
  };
  this.setPluginState({
    results: [...state.results, entry]
  });
  this.uppy.emit('transloadit:result', stepName, result, this.getAssembly(assemblyId));
}

function _onAssemblyFinished2(status) {
  const url = status.assembly_ssl_url;
  this.client.getAssemblyStatus(url).then(finalStatus => {
    const assemblyId = finalStatus.assembly_id;
    const state = this.getPluginState();
    this.setPluginState({
      assemblies: { ...state.assemblies,
        [assemblyId]: finalStatus
      }
    });
    this.uppy.emit('transloadit:complete', finalStatus);
  });
}

async function _cancelAssembly2(assembly) {
  await this.client.cancelAssembly(assembly); // TODO bubble this through AssemblyWatcher so its event handlers can clean up correctly

  this.uppy.emit('transloadit:assembly-cancelled', assembly);
}

function _connectAssembly2(assembly) {
  const {
    status
  } = assembly;
  const id = status.assembly_id;
  this.activeAssemblies[id] = assembly; // Sync local `assemblies` state

  assembly.on('status', newStatus => {
    const {
      assemblies
    } = this.getPluginState();
    this.setPluginState({
      assemblies: { ...assemblies,
        [id]: newStatus
      }
    });
  });
  assembly.on('upload', file => {
    _classPrivateFieldLooseBase(this, _onFileUploadComplete)[_onFileUploadComplete](id, file);
  });
  assembly.on('error', error => {
    error.assembly = assembly.status; // eslint-disable-line no-param-reassign

    this.uppy.emit('transloadit:assembly-error', assembly.status, error);
  });
  assembly.on('executing', () => {
    this.uppy.emit('transloadit:assembly-executing', assembly.status);
  });

  if (this.opts.waitForEncoding) {
    assembly.on('result', (stepName, result) => {
      _classPrivateFieldLooseBase(this, _onResult)[_onResult](id, stepName, result);
    });
  }

  if (this.opts.waitForEncoding) {
    assembly.on('finished', () => {
      _classPrivateFieldLooseBase(this, _onAssemblyFinished)[_onAssemblyFinished](assembly.status);
    });
  } else if (this.opts.waitForMetadata) {
    assembly.on('metadata', () => {
      _classPrivateFieldLooseBase(this, _onAssemblyFinished)[_onAssemblyFinished](assembly.status);
    });
  } // No need to connect to the socket if the Assembly has completed by now.


  if (assembly.ok === 'ASSEMBLY_COMPLETE') {
    return assembly;
  }

  assembly.connect();
  return assembly;
}

Transloadit.VERSION = packageJson.version;
Transloadit.COMPANION = COMPANION_URL;
Transloadit.COMPANION_PATTERN = COMPANION_ALLOWED_HOSTS;
export { COMPANION_URL, COMPANION_ALLOWED_HOSTS };