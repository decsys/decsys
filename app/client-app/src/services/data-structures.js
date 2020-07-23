/**
 * Returns an array of keys which have truthy, or falsey values in an object
 * @param {Object} o the object to find truthy or falsey keys in
 * @param {boolean} [truthy] whether to look for truthy or falsey values. Defaults to truthy.
 */
export const listMatchingKeys = (o, truthy = true) =>
  Object.keys(o).filter(k => !!o[k] === truthy);

/**
 * Reduce an array of objects to a keyed dictionary of those objects
 * in the form
 * ```
 *     {
 *         [object[keyProp]]: object
 *         ...
 *     }
 * ```
 * @param {object[]} data a list of objects
 * @param {any} [keyProp] the property of each object to use as a unique dictionary key.
 *
 * defaults to `"id"`
 */
export const toDictionary = (data, keyProp = "id") =>
  // TODO: make this even more like C#'s `Enumerable.ToDictionary()`
  data.reduce((acc, datum) => {
    acc[datum[keyProp]] = datum;
    return acc;
  }, {});
