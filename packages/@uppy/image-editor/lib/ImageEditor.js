import { UIPlugin } from '@uppy/core';
import { h } from 'preact';
import Editor from "./Editor.js";
const packageJson = {
  "version": "2.1.0"
};
import locale from './locale.js';
export default class ImageEditor extends UIPlugin {
  constructor(uppy, opts) {
    super(uppy, opts);

    this.save = () => {
      const saveBlobCallback = blob => {
        const {
          currentImage
        } = this.getPluginState();
        this.uppy.setFileState(currentImage.id, {
          data: blob,
          size: blob.size,
          preview: null
        });
        const updatedFile = this.uppy.getFile(currentImage.id);
        this.uppy.emit('thumbnail:request', updatedFile);
        this.setPluginState({
          currentImage: updatedFile
        });
        this.uppy.emit('file-editor:complete', updatedFile);
      };

      const {
        currentImage
      } = this.getPluginState();
      this.cropper.getCroppedCanvas(this.opts.cropperOptions.croppedCanvasOptions).toBlob(saveBlobCallback, currentImage.type, this.opts.quality);
    };

    this.storeCropperInstance = cropper => {
      this.cropper = cropper;
    };

    this.selectFile = file => {
      this.uppy.emit('file-editor:start', file);
      this.setPluginState({
        currentImage: file
      });
    };

    this.id = this.opts.id || 'ImageEditor';
    this.title = 'Image Editor';
    this.type = 'editor';
    this.defaultLocale = locale;
    const defaultCropperOptions = {
      viewMode: 1,
      background: false,
      autoCropArea: 1,
      responsive: true,
      croppedCanvasOptions: {}
    };
    const defaultActions = {
      revert: true,
      rotate: true,
      granularRotate: true,
      flip: true,
      zoomIn: true,
      zoomOut: true,
      cropSquare: true,
      cropWidescreen: true,
      cropWidescreenVertical: true
    };
    const defaultOptions = {
      quality: 0.8
    };
    this.opts = { ...defaultOptions,
      ...opts,
      actions: { ...defaultActions,
        ...opts.actions
      },
      cropperOptions: { ...defaultCropperOptions,
        ...opts.cropperOptions
      }
    };
    this.i18nInit();
  } // eslint-disable-next-line class-methods-use-this


  canEditFile(file) {
    if (!file.type || file.isRemote) {
      return false;
    }

    const fileTypeSpecific = file.type.split('/')[1];

    if (/^(jpe?g|gif|png|bmp|webp)$/.test(fileTypeSpecific)) {
      return true;
    }

    return false;
  }

  install() {
    this.setPluginState({
      currentImage: null
    });
    const {
      target
    } = this.opts;

    if (target) {
      this.mount(target, this);
    }
  }

  uninstall() {
    const {
      currentImage
    } = this.getPluginState();

    if (currentImage) {
      const file = this.uppy.getFile(currentImage.id);
      this.uppy.emit('file-editor:cancel', file);
    }

    this.unmount();
  }

  render() {
    const {
      currentImage
    } = this.getPluginState();

    if (currentImage === null || currentImage.isRemote) {
      return null;
    }

    return h(Editor, {
      currentImage: currentImage,
      storeCropperInstance: this.storeCropperInstance,
      save: this.save,
      opts: this.opts,
      i18n: this.i18n
    });
  }

}
ImageEditor.VERSION = packageJson.version;