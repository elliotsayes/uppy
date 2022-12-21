import { UIPlugin } from '@uppy/core';
import { Provider } from '@uppy/companion-client';
import { ProviderViews } from '@uppy/provider-views';
import { h } from 'preact';
const packageJson = {
  "version": "3.0.1"
};
import locale from './locale.js';
export default class Dropbox extends UIPlugin {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.id = this.opts.id || 'Dropbox';
    Provider.initPlugin(this, opts);
    this.title = this.opts.title || 'Dropbox';

    this.icon = () => h("svg", {
      "aria-hidden": "true",
      focusable: "false",
      width: "32",
      height: "32",
      viewBox: "0 0 32 32"
    }, h("g", {
      fill: "none",
      fillRule: "evenodd"
    }, h("rect", {
      className: "uppy-ProviderIconBg",
      fill: "#0D2481",
      width: "32",
      height: "32",
      rx: "16"
    }), h("path", {
      d: "M11 8l5 3.185-5 3.186-5-3.186L11 8zm10 0l5 3.185-5 3.186-5-3.186L21 8zM6 17.556l5-3.185 5 3.185-5 3.186-5-3.186zm15-3.185l5 3.185-5 3.186-5-3.186 5-3.185zm-10 7.432l5-3.185 5 3.185-5 3.186-5-3.186z",
      fill: "#FFF",
      fillRule: "nonzero"
    })));

    this.provider = new Provider(uppy, {
      companionUrl: this.opts.companionUrl,
      companionHeaders: this.opts.companionHeaders,
      companionKeysParams: this.opts.companionKeysParams,
      companionCookiesRule: this.opts.companionCookiesRule,
      provider: 'dropbox',
      pluginId: this.id
    });
    this.defaultLocale = locale;
    this.i18nInit();
    this.title = this.i18n('pluginNameDropbox');
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
Dropbox.VERSION = packageJson.version;