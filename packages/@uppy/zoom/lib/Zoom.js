import { h } from 'preact';
import { UIPlugin } from '@uppy/core';
import { Provider } from '@uppy/companion-client';
import { ProviderViews } from '@uppy/provider-views';
const packageJson = {
  "version": "2.0.1"
};
import locale from './locale.js';
export default class Zoom extends UIPlugin {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.id = this.opts.id || 'Zoom';
    Provider.initPlugin(this, opts);
    this.title = this.opts.title || 'Zoom';

    this.icon = () => h("svg", {
      "aria-hidden": "true",
      focusable: "false",
      width: "32",
      height: "32",
      viewBox: "0 0 32 32"
    }, h("rect", {
      className: "uppy-ProviderIconBg",
      width: "32",
      height: "32",
      rx: "16",
      fill: "#0E71EB"
    }), h("g", {
      fill: "none",
      fillRule: "evenodd"
    }, h("path", {
      fill: "#fff",
      d: "M29,31H14c-1.657,0-3-1.343-3-3V17h15c1.657,0,3,1.343,3,3V31z",
      style: {
        transform: 'translate(-5px, -5px) scale(0.9)'
      }
    }), h("polygon", {
      fill: "#fff",
      points: "37,31 31,27 31,21 37,17",
      style: {
        transform: 'translate(-5px, -5px) scale(0.9)'
      }
    })));

    this.provider = new Provider(uppy, {
      companionUrl: this.opts.companionUrl,
      companionHeaders: this.opts.companionHeaders,
      companionKeysParams: this.opts.companionKeysParams,
      companionCookiesRule: this.opts.companionCookiesRule,
      provider: 'zoom',
      pluginId: this.id
    });
    this.defaultLocale = locale;
    this.i18nInit();
    this.title = this.i18n('pluginNameZoom');
    this.onFirstRender = this.onFirstRender.bind(this);
    this.render = this.render.bind(this);
  }

  install() {
    this.view = new ProviderViews(this, {
      provider: this.provider
    });
    const {
      target
    } = this.opts;

    if (target) {
      this.mount(target, this);
    }
  }

  uninstall() {
    this.view.tearDown();
    this.unmount();
  }

  onFirstRender() {
    return Promise.all([this.provider.fetchPreAuthToken(), this.view.getFolder()]);
  }

  render(state) {
    return this.view.render(state);
  }

}
Zoom.VERSION = packageJson.version;