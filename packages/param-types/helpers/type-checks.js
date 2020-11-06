import { ParamType } from "../param-types";

export const simpleTypeCheck = (arg, typeName, argName) => {
  // some types have special checks
  let valid;
  switch (typeName) {
    case "array": // arrays are typeof "object" so we need to confirm them
      valid = Array.isArray(arg);
      break;
    case "object": // arrays are typeof "object" so we need to ignore them
      valid = typeof arg === "object" && !Array.isArray(arg);
      break;
    default:
      typeof typeName === "string"
        ? (valid = typeof arg === typeName) // all other strings we can use typeof
        : (valid = arg instanceof typeName); // any non strings should be assumed to want instanceof checks
  }

  if (!valid)
    throw new TypeError(
      `Expected ${
        argName && `'${argName}' to be of `
      }type '${typeName}', but got ${typeof arg}: '${arg}'`
    );
};

export const isString = (arg, name) => simpleTypeCheck(arg, "string", name);
export const isNumber = (arg, name) => simpleTypeCheck(arg, "number", name);
export const isBoolean = (arg, name) => simpleTypeCheck(arg, "boolean", name);
export const isArray = (arg, name) => simpleTypeCheck(arg, "array", name);
export const isPlainObject = (arg, name) =>
  simpleTypeCheck(arg, "object", name);

export const isParamType = (arg, name) => simpleTypeCheck(arg, ParamType, name);

export const isInteger = (value) => !isNaN(parseInt(value));
