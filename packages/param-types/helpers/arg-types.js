import { types } from "../param-types";
import { reduceParamTypes } from "./reduce-param-types";
import { buildPaths } from "./param-paths";

/**
 * Get the React PropType for a plan JS object (shape)
 * or a DECSYS ParamType
 * @param {*} node
 */
const getArgType = (key, node) => {
  switch (node.type) {
    case types.arrayOf:
      return { name: key, type: "array", control: "array" };
    case types.shape:
      return { name: key, type: "object", control: "object" };
    case types.oneOf:
      return {
        name: key,
        type: "enum",
        control: { type: "select", options: node.validValues },
      };
    case types.integer:
      return { name: key, type: "number", control: "number" };
    case types.color:
      return { name: key, type: "string", control: "color" };
    case types.string:
      return { name: key, type: "string", control: "text" };
    case types.bool:
      return {
        name: key,
        type: "boolean",
        control: "boolean",
      };
    default:
      return null; // unknown type?
  }
};

export const buildArgTypes = (paramTypes, root = true) => {
  // for arg types, because storybook's controls aren't that advanced
  // for complex structures (shapes, arrays)
  // we pretty much just do top level paths
  // so this is much simpler than prop types, or the params editor
  //
  // however nested paths (tree2) won't work without further mapping to the prop
  // in the story. // TODO: maybe we can provide a helper for that later...

  const propPaths = reduceParamTypes(paramTypes, buildPaths, {}, root);
  const pathKeys = Object.keys(propPaths);

  // we can actually process tree 1 while we build tree 2
  let { argTypes } = pathKeys.reduce(
    (result, path) => {
      const node = propPaths[path];

      if (path.split(".").length > 1) {
        // actually we don't use tree2 at this time
        // so all nested paths get discarded, for now.
        //
        // later behaviour similar to propTypes may be needed
        return result;
      }

      // if we got here, then it's NOT a nested path
      // and we are in essence processing "tree 1"
      return {
        ...result,
        argTypes: {
          ...result.argTypes,
          [path]: getArgType(path, node),
        },
      };
    },
    { argTypes: {}, tree2: {} }
  );

  // TODO: add tree2 in future, same as propTypes

  return argTypes;
};
