import { types } from "../param-types";
import { reduceParamTypes } from "./reduce-param-types";
import { isInteger } from "./type-checks";

/**
 * Immutably calculate a path for a node
 * possibly relative to a parent
 * @param {*} key the key of the node
 * @param {*} node the value of the node
 * @param {object} parent parent node context:
 * - `node` - the parent node
 * - `path` - the path calculated for the parent
 */
export const getNodePath = (key, node, parent) => {
  const isArrayChild = parent?.node?.type === types.arrayOf;
  // if WE are an array child
  // we must yield our key, and ignore a specified path
  if (isArrayChild) return key;

  const nodePath = node.path || key;

  // I realise this could be written more succinctly
  // but it's easier to enumerate the cases thusly:

  // no parent? no nested path possible
  if (!parent?.path) return nodePath;

  const nestedPath = `${parent.path}.${nodePath}`;

  // if the parent path leads with an integer
  // there's an array in the hierarchy somewhere
  // and we need to preserve the index in some form
  if (isInteger(parent.path)) {
    // how much we keep depends on:
    // is our parent a DIRECT array child?
    // do we have an override path?
    // does our parent use flatPaths?
    const segments = parent.path.split(".");

    if (segments.length === 1)
      // parent is direct child
      // this looks like it could go in the `else` case
      // but it's higher precedence than overrides/flatPaths
      return nestedPath;

    // override or flatPaths
    // we need a custom nested path
    // that retains only the index
    if (node.path || parent.node?.flatPaths)
      return `${segments[0]}.${nodePath}`;

    // any other integer path case
    return nestedPath;
  }

  // NOW ordinary override paths / flatPaths are allowed
  if (node.path || parent.node?.flatPaths) return nodePath;

  // all other scenarios
  return nestedPath;
};

/**
 * Build a dictionary of path strings from a ParamTypes tree.
 * Can be used to construct trees representing the target props structure
 * e.g. for PropTypes, ArgTypes etc...
 * @param {*} paths the output paths object we're reducing to
 * @param {*} _context may contain parent node details: the node, the path...
 * @param {*} key the key of this node
 * @param {*} node the value of this node
 */
export const buildPaths = (paths, key, node, _context = {}) => {
  if (_context.namespace) {
    return {
      ...paths,
      ...reduceParamTypes(node, buildPaths, {
        ..._context,
        namespace: undefined,
      }),
    };
  }

  switch (node.type) {
    case types.shape:
      const shapePath = getNodePath(key, node, _context.parent);
      const childPaths = reduceParamTypes(node.childTypes, buildPaths, {
        parent: { node, path: shapePath },
      });
      const childKeys = Object.keys(node.childTypes);

      const result = { ...paths, ...childPaths };

      if (
        !node.flatPaths &&
        childKeys.some((key) => !node.childTypes[key].path)
      )
        result[shapePath] = node;

      return result;
    case types.arrayOf:
      const arrayPath = getNodePath(key, node, _context.parent);
      let arrayResult = node;

      switch (node.childType.type) {
        case types.shape:
          arrayResult = {
            ...arrayResult,
            childPaths: reduceParamTypes(
              node.childType.childTypes,
              buildPaths,
              {
                _context: { parent: node, path: arrayPath },
              }
            ),
          };
          break;
        case types.arrayOf:
          arrayResult = {
            ...arrayResult,
            ...reduceParamTypes({ childPaths: node.childType }, buildPaths, {
              _context: { parent: node, path: arrayPath },
            }),
          };
          break;
        default:
          break;
      }

      return {
        ...paths,
        [arrayPath]: arrayResult,
      };
    default:
      return {
        ...paths,
        [getNodePath(key, node, _context.parent)]: node,
      };
  }
};
