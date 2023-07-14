import { useSortingAndFiltering } from "hooks/useSortingAndFiltering";

export const useWordlistSortingAndFiltering = (data) => {
  const filterers = {
    wordContains: "word",
    minLengthIsMet: (value, filter) => value.word.length >= filter,
    maxLengthIsNotExceeded: (value, filter) => value.word.length <= filter,
    typeMatches: (value, filter) => {
      switch (filter) {
        case "Adjective":
          return value.type === "adjective";
        case "Noun":
          return value.type === "noun";
        case "All":
        default:
          return true;
      }
    },
    exclusionStateMatches: (value, filter) => {
      switch (filter) {
        case "Excluded":
          return value.isExcludedBuiltin;
        case "Included":
          return !value.isExcludedBuiltin;
        case "All":
        default:
          return true;
      }
    },
  };

  return useSortingAndFiltering(data, filterers, {
    initialSort: {
      key: "word",
    },
    sorters: {
      word: {
        sorter: (asc) => (a, b) =>
          asc ? a.localeCompare(b) : b.localeCompare(a),
      },
      type: {
        sorter: (asc) => (a, b) =>
          asc ? a.localeCompare(b) : b.localeCompare(a),
      },
      isExcludedBuiltin: {
        sorter: (asc) => (a, b) => asc ? +a - +b : +b - +a,
      },
    },
    storageKey: "wordlist",
  });
};
