// process the ParamTypes dictionary
// run some checks
// then run a reducer on each node
export const reduceParamTypes = (
  paramTypes,
  reducer = () => {},
  _context,
  root = false
) =>
  Object.keys(paramTypes).reduce((result, key) => {
    const node = paramTypes[key];
    if (!node) return result;

    if (!node.type) {
      // TODO: Document that namespaces must not contain a key of `type`
      if (!root) {
        console.error(`ParamType Value at ${key} has no type property.`);
        return result;
      }

      // typeless objects at root are valid as Sections
      return reducer(result, key, node, { ..._context, namespace: key }); // use namespace to show it's in a namespace
    }

    return reducer(result, key, node, _context);
  }, {});
