// This is like our platform version of Prop Types,
// because Prop Types is very closured,
// so we can't query information about the types after the fact
// We can use the declarations here to inform PropTypes though,
// to avoid repetition, which is what setParams does
import * as builders from "./builders";
import * as types from "./types";
import setParams from "./setParams";

// named * exports
export * from "./builders";

// other named exports
export { setParams, types };

// default export
export default { setParams, ...builders, types };
