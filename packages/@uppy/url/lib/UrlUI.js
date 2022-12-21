function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

import { h, Component } from 'preact';

var _handleKeyPress = /*#__PURE__*/_classPrivateFieldLooseKey("handleKeyPress");

var _handleSubmit = /*#__PURE__*/_classPrivateFieldLooseKey("handleSubmit");

class UrlUI extends Component {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, _handleKeyPress, {
      writable: true,
      value: ev => {
        if (ev.keyCode === 13) {
          _classPrivateFieldLooseBase(this, _handleSubmit)[_handleSubmit]();
        }
      }
    });
    Object.defineProperty(this, _handleSubmit, {
      writable: true,
      value: () => {
        const {
          addFile
        } = this.props;
        const preparedValue = this.input.value.trim();
        addFile(preparedValue);
      }
    });
  }

  componentDidMount() {
    this.input.value = '';
  }

  render() {
    const {
      i18n
    } = this.props;
    return h("div", {
      className: "uppy-Url"
    }, h("input", {
      className: "uppy-u-reset uppy-c-textInput uppy-Url-input",
      type: "text",
      "aria-label": i18n('enterUrlToImport'),
      placeholder: i18n('enterUrlToImport'),
      onKeyUp: _classPrivateFieldLooseBase(this, _handleKeyPress)[_handleKeyPress],
      ref: input => {
        this.input = input;
      },
      "data-uppy-super-focusable": true
    }), h("button", {
      className: "uppy-u-reset uppy-c-btn uppy-c-btn-primary uppy-Url-importButton",
      type: "button",
      onClick: _classPrivateFieldLooseBase(this, _handleSubmit)[_handleSubmit]
    }, i18n('import')));
  }

}

export default UrlUI;