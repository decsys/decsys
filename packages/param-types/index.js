// This is like our platform version of Prop Types,
// because Prop Types is very closured,
// so we can't query information about the types after the fact
// We can use the declarations here to inform PropTypes though,
// to avoid repetition, which is what buildPropTypes does
import * as builders from "./builders";
import * as types from "./types";
import {
  renderContextPropTypes,
  previewEditorContextPropTypes,
  paramsEditorContextPropTypes,
} from "./ResponseItemContexts";
import buildPropTypes from "./buildPropTypes";

// named * exports
export * from "./builders";

// other named exports
export {
  buildPropTypes,
  types,
  renderContextPropTypes,
  previewEditorContextPropTypes,
  paramsEditorContextPropTypes,
};

// default export
export default {
  buildPropTypes,
  ...builders,
  types,
  renderContextPropTypes,
  previewEditorContextPropTypes,
  paramsEditorContextPropTypes,
};
