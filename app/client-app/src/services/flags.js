/**
 * Helpers for working with a dictionary of boolean flags
 */

/**
 * Determine whether some members of an object are true
 * @param {*} flags
 * @param {boolean} loose whether to test only for "truthy" rather than exactly true members
 */
export const some = (flags, loose = false) =>
  Object.keys(flags).some(k => isTruthy(flags[k], loose));

/**
 * Determine whether all members of an object are true
 * @param {*} flags an object containing keys with boolean values only
 * @param {boolean} loose whether to test only for "truthy" rather than exactly true members
 */
export const every = (flags, loose = false) => {
  const keys = Object.keys(flags);
  return keys.length > 0 && keys.every(k => isTruthy(flags[k], loose));
};

/**
 * Is a value exactly true, or truthy
 * @param {*} val The value to test
 * @param {boolean} loose test the value is exactly true, or only loosely truthy
 */
const isTruthy = (val, loose = false) => (loose ? !!val : val === true);
