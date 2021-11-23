import * as types from "./types";

const converters = {
  [types.string]: (value) => (value != null ? value.toString() : undefined),
  [types.oneOf]: (value) => value,
  [types.number]: (value) => parseFloat(value),
  [types.bool]: (value) => !!value,
};

const validators = {
  [types.number]: {
    isValid: (value) => !isNaN(value),
    error: () =>
      `The value provided is not a number, or could not be converted to one`,
  },
  [types.oneOf]: {
    isValid: (value, paramType) => paramType.oneOf.includes(value),
    error: (paramType) =>
      `The value provided is not a valid value: ${paramType.oneOf}`,
  },
};

/**
 * Ensures param values adhere to a ParamTypes spec (by coercing types if necessary)
 * and, if all values are valid, returns a new param values dictionary with the correct types.
 *
 * If any value cannot be coerced to a valid value (in both type and content, where appropriate)
 * an error is thrown.
 *
 * @param {object} paramTypes
 * @param {object} paramValues
 * @returns {object} a new param values dictionary with types fixed
 */
export const ensureParamTypes = (paramTypes, paramValues) => {
  // TODO: in future we can use this to check isRequired?
  // or possibly modify default handling for a better experience?

  const paramKeys = Object.keys(paramTypes);
  return paramKeys.reduce((values, key) => {
    const paramType = paramTypes[key];

    // First see if a value has been provided;
    // else use default (but continue to check it to catch paramTypes errors)
    let value = paramValues.hasOwnProperty(key)
      ? paramValues[key]
      : paramType.defaultValue;

    // Now coerce the value to the expected type
    value = converters[paramType.type](value);

    // Now validate the coerced value
    const validator = validators[paramType.type];
    if (!(validator?.isValid(value, paramType) ?? true)) {
      throw new Error(
        `ParamType validation failed for: [${key}]: ${
          paramValues[key]
        }.\n${validator.error(paramType)}`
      );
    }

    return { ...values, [key]: value };
  }, {});
};
