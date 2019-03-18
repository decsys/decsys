/**
 * Gets the appropriate sort function for a given survey property.
 *
 * @param {string} key The survey property to sort by.
 * @param {boolean} asc Sort ascending or descending.
 */
const getPropertySorter = (key, asc) => {
  const defaultSorter = ({ [key]: a }, { [key]: b }) => (asc ? a - b : b - a);

  const sorters = {
    name: ({ [key]: a }, { [key]: b }) =>
      asc ? a.localeCompare(b) : b.localeCompare(a)
  };

  return sorters[key] || defaultSorter;
};

/**
 * Build a lookup list of object IDs and names
 * sorted by the specified object property,
 * ascending or descending.
 *
 * @param {object[]} input The source list of objects.
 * @param {string} key The object property to sort by.
 * @param {boolean} asc Sort ascending or descending.
 */
export const getSortedLookup = (input, key, asc) =>
  Object.keys(input)
    .map(id => input[id])
    .sort(getPropertySorter(key, asc))
    .map(({ id, name }) => ({ id, name }));

/**
 * Filters a list of objects with a `name` property
 * where the `name` contains a match on the `filter` string.
 *
 * If no filter is specified, the full input list is returned.
 *
 * @param {object[]} input The source list of objects.
 * @param {string} filter The filter string to match against.
 */
export const getFilteredLookup = (input, filter) =>
  !filter
    ? input
    : input.filter(({ name }) => new RegExp(filter, "i").test(name));
