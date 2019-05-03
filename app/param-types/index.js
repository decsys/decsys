// This is like our platform version of Prop Types,
// because Prop Types is very closured,
// so we can't query information about the types after the fact
// We can use the declarations here to inform PropTypes though,
// to avoid repetition, which is what buildPropTypes does
import { string, stringUndefined, bool, number, bool, oneOf } from "./builders";
import * as types from "./types";
import buildPropTypes from "./buildPropTypes";

// named * exports
export * from "./builders";

// other named exports
export { buildPropTypes, types };

// default export

/* This would be ideal but Classic Edge doesn't support the object spread operator:
 *   `export default { setParams, ...builders, types };`
 * So we import/export individually for now
 */

export default {
  buildPropTypes,
  types,
  // builders:
  string,
  stringUndefined,
  bool,
  number,
  bool,
  oneOf
};
