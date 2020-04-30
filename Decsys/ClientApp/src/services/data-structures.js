/**
 * Returns an array of keys which have truthy, or falsey values in an object
 * @param {Object} o the object to find truthy or falsey keys in
 * @param {boolean} [truthy] whether to look for truthy or falsey values. Defaults to truthy.
 */
export const listMatchingKeys = (o, truthy = true) =>
  Object.keys(o).filter(k => !!o[k] === truthy);
