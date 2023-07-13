import { useState, useEffect } from "react";

/**
 * Gets the appropriate sort function for a given object property.
 *
 * @param {string} key The object property to sort by.
 * @param {boolean} asc Sort ascending or descending.
 * @param {object} sorters Custom sorting behaviours.
 *
 * It's possible to specify for a given sorting key an alternative object property to sort against,
 * or alternative sorting logic as a sorting predicate (asc) => (a, b) => {}
 *
 * example:
 * {
 *   active: { property: "activeInstanceId" },
 *   name: {sorter: asc => (a, b) => asc ? a.localeCompare(b) : b.localeCompare(a) }
 * }
 *
 */
const getPropertySorter = (key, asc, sorters = {}) => {
  const customSorter = sorters[key] ?? {};

  const { property, sorter } = customSorter;
  return ({ [property ?? key]: a }, { [property ?? key]: b }) => {
    if (sorter) {
      return sorter(asc)(a, b);
    } else {
      return asc ? a - b : b - a;
    }
  };
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
const getSortedLookup = (input, key, asc, sorters) =>
  Object.keys(input)
    .map((id) => input[id])
    .sort(getPropertySorter(key, asc, sorters));

/**
 * Filters a list of objects with a specified property where said property contains a match
 * on the `filter` string. If no filter is specified, the full input list is returned.
 *
 * @param {object[]} input The source list of objects.
 * @param {object} filterConfig The configuration object for filters. The keys should match with filterers and values should be filter value.
 * For example: { nameContains: "John" }
 *
 * @param {object} filterers
 * If a string, is a property name used to match against filter.
 * For example: { nameContains: "name" }
 *
 * If a function, is executed to perform custom filtering, with the signature (input, filter) => {}
 * For example: { nameContains: (input, filter) => input.name.includes(filter) }
 *
 * @returns {object[]} A filtered list based on the filterConfig and filterers.
 */

export const getFilteredLookup = (input, filterConfig = {}, filterers = {}) =>
  input.filter((value) =>
    Object.entries(filterers).every(([key, filterer]) => {
      const filter = filterConfig[key];
      if (!filter) return true;
      if (typeof filterer === "string") {
        return new RegExp(filter, "i").test(value[filterer]);
      } else if (typeof filterer === "function") {
        return filterer(value, filter);
      }
      return false;
    })
  );

const storageKeyPrefix = "sargassure.sorting";

/**
 * A custom hook that manages sorting and filtering operations for a list of objects.
 * The hook keeps track of the sorting and filtering configuration, the sorted list, and the final output list after filtering.
 *
 * @param {object[]} sourceList The source list of objects.
 * @param {object} filterers Configuration for filters. The keys should match with filterConfig in setFilter and values should be filter property or function.
 * @param {object} options Contains configuration for initial sort key, sorters for different properties and local storage key for saving sort state.
 *
 * @returns {object} An object containing following:
 * - sorting: The current sorting state, with a key for the sorting column and a boolean indicating whether it's ascending.
 * - setSorting: A function to directly set the sorting state.
 * - onSort: A function that updates the sort key and toggles ascending/descending.
 * - filterConfig: The current filtering configuration, with each filter's current state.
 * - setFilter: A function to update a specific filter.
 * - outputList: The list of objects after sorting and filtering.
 */
export const useSortingAndFiltering = (
  sourceList,
  filterers = { nameContains: "name" },
  { initialSort, sorters, storageKey }
) => {
  const storageKeyFull = `${storageKeyPrefix}.${storageKey}`;

  const [sorting, setSorting] = useState(
    JSON.parse(localStorage.getItem(storageKeyFull)) || {
      key: initialSort?.key ?? "name",
      [initialSort.key ?? "name"]: initialSort?.asc,
    }
  );

  const [sortedList, setSortedList] = useState([]);
  const [filterConfig, setFilterConfig] = useState(
    Object.keys(filterers).reduce(
      (acc, key) => ({
        ...acc,
        [key]: key === "wordLengthIsInRange" ? [1, 15] : "",
      }),
      {}
    )
  );

  const [outputList, setOutputList] = useState([]);
  // update the sorted list appropriately
  useEffect(() => {
    setSortedList(
      getSortedLookup(sourceList, sorting.key, sorting[sorting.key], sorters)
    );
    // also save the new sort for next time
    localStorage.setItem(storageKeyFull, JSON.stringify(sorting));
  }, [sourceList, sorting]);

  // update the filtered list appropriately
  useEffect(() => {
    setOutputList(getFilteredLookup(sortedList, filterConfig, filterers));
  }, [filterConfig, sortedList]);

  // default sort handler
  const handleSort = (key) => {
    setSorting({
      ...sorting,
      key,
      [key]: sorting.key === key ? !sorting[key] : sorting[key],
    });
  };

  const setFilter = (key, value) => {
    setFilterConfig((prevConfig) => ({ ...prevConfig, [key]: value }));
  };

  return {
    sorting,
    setSorting,
    onSort: handleSort,
    filterConfig,
    setFilter,
    outputList,
  };
};
