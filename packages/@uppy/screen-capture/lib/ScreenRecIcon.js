import { h } from 'preact';
export default (() => {
  return h("svg", {
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
    fill: "#2C3E50",
    width: "32",
    height: "32",
    rx: "16"
  }), h("path", {
    d: "M24.182 9H7.818C6.81 9 6 9.742 6 10.667v10c0 .916.81 1.666 1.818 1.666h4.546V24h7.272v-1.667h4.546c1 0 1.809-.75 1.809-1.666l.009-10C26 9.742 25.182 9 24.182 9zM24 21H8V11h16v10z",
    fill: "#FFF",
    fillRule: "nonzero"
  }), h("circle", {
    fill: "#FFF",
    cx: "16",
    cy: "16",
    r: "2"
  })));
});