/**
 * Gets the appropriate sort function for a given survey property.
 *
 * @param {string} key The survey property to sort by.
 * @param {boolean} asc Sort ascending or descending.
 */
const getPropertySorter = (key, asc) => {
  const defaultSorter = (a, b) => (asc ? a - b : b - a);

  const sorters = {
    name: (
      { [key]: a },
      { [key]: b } // use custom sort logic
    ) => (asc ? a.localeCompare(b) : b.localeCompare(a)),
    active: (
      // use custom property keys
      { activeInstanceId: a = 0 },
      { activeInstanceId: b = 0 }
    ) => defaultSorter(a, b) // but use default sort logic
  };

  return (
    sorters[key] ||
    // if no special case found, plug into the default logic, with the default property key mapping
    (({ [key]: a }, { [key]: b }) => defaultSorter(a, b))
  );
};

/**
 * Build a lookup list of object IDs and names
 * sorted by the specified object property,
 * ascending or descending.
 *
 * @param {object} input The source dictionary of objects.
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
