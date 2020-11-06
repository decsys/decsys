/* eslint-disable react/forbid-foreign-prop-types */
// kinda the point of this module ;)

// TODO: need helpers for `defaultProps`
// It's a lot like propTypes, but kinda the opposite
// led merge an object for LEAF paths only?
// so skip `shape` paths
// `arrays` default to []
// all value types use the `default` property or are skipped (undefined)
// nested paths will ultimately provide `shape` defaults where they apply
// no need for tree2, then
// or any nested nonsense, ld merge/set take care of that

import { types } from "../param-types";
import PropTypes from "prop-types";
import { reduceParamTypes } from "./reduce-param-types";
import { buildPaths } from "./param-paths";
import { merge, set } from "lodash-es";

/**
 * get a shape PropType
 * with a function specified for generating child prop types
 * @param {*} f The function to generate child prop types
 * @param {*} children Children of the shape
 */
const getShapePropType = (f, children, ...args) =>
  PropTypes.shape(f(children, ...args));

/**
 * Get the React PropType for a plan JS object (shape)
 * or a DECSYS ParamType
 * @param {*} node
 */
const getPropType = (node) => {
  // no `type`? this is an object literal
  // whose keys should be further shapes,
  // or ParamTypes
  if (!node.type) return getShapePropType(buildObjectPropTypes, node);

  // if we have a `type` we're a ParamType and should proceed accordingly
  switch (node.type) {
    case types.arrayOf:
      let childPropType;
      if (!node.childPaths) {
        // Primitive childtype; just get the prop type and call it a day
        childPropType = getPropType(node.childType);
        break;
      }

      // if we have childPaths, we're a container type like shape/array
      if (!node.childPaths.type) {
        // if the childPath has no type, it's an object literal
        // representing the paths from a shape
        childPropType = getShapePropType(buildPropTypes, node.childPaths);
        break;
      }

      // if childPaths has a type, currently it means we're an array
      // but in future we may want to adjust behaviour for other container types too
      switch (node.childPaths.type) {
        case types.arrayOf:
          childPropType = buildPropTypes({ arrayChild: node.childType })
            .arrayChild;
          break;
        default:
          console.error("Unknown childPaths type:", node);
          throw new Error(`unknown childPaths type: ${node.childPaths.type}`);
      }
      return PropTypes.arrayOf(childPropType);
    case types.shape:
      return getShapePropType(buildPropTypes, node.childTypes, false);
    case types.oneOf:
      return PropTypes.oneOf(node.validValues);
    case types.integer:
      return PropTypes.number;
    case types.color:
      return PropTypes.string;
    default:
      return PropTypes[node.type];
  }
};

/**
 * Get PropTypes for a plain JS object literal
 * whose children are EITHER furher literals or ParamTypes
 * @param {*} o the object
 */
const buildObjectPropTypes = (o) => {
  return Object.keys(o).reduce(
    (propTypes, key) => ({
      ...propTypes,
      [key]: getPropType(o[key]),
    }),
    {}
  );
};

export const buildPropTypes = (paramTypes, root = true) => {
  // from the result of buildPaths, we need to produce 2 trees to build PropTypes from
  //
  // one is all the root paths (no nesting), which can be directly converted to propTypes
  // even if they contain nested types (arrays/shapes)
  //
  // the other must be made of all nested root paths that aren't already covered
  // by root paths containing ParamType definitions
  // building this tree allows us to iterate through nested shapes we need to generate
  // (where we lack ParamTypes) to get to the leaves of the paths we DO have ParamTypes at.
  // This is also results in naturally discarding nested paths that HAVE been covered
  // by a root ParamType definition (e.g. a shape)

  const propPaths = reduceParamTypes(paramTypes, buildPaths, {}, root);
  const pathKeys = Object.keys(propPaths);

  // we can actually process tree 1 while we build tree 2
  let { propTypes, tree2 } = pathKeys.reduce(
    (result, path) => {
      const node = propPaths[path];

      if (path.split(".").length > 1) {
        // this is a nested path, so special action needs taking

        // if this nested path is covered by another path, ignore it
        // this is the discarding discussed above
        if (pathKeys.some((p) => p !== path && path.startsWith(p))) {
          return result;
        }

        // otherwise, we will need this nested path to be in the second tree
        // so we can process that later
        return {
          ...result,
          tree2: merge({}, result.tree2, set({}, path, node)),
        };
      }

      // if we got here, then it's NOT a nested path
      // and we are in essence processing "tree 1"
      switch (node.type) {
        default:
          return {
            ...result,
            propTypes: {
              ...result.propTypes,
              [path]: getPropType(node),
            },
          };
      }
    },
    { propTypes: {}, tree2: {} }
  );

  // for root, add tree2 types
  if (root)
    propTypes = {
      ...propTypes,
      ...buildObjectPropTypes(tree2),
    };

  return propTypes;
};
