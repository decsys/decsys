import { useSortingAndFiltering } from "hooks/useSortingAndFiltering";

export const useWordlistSortingAndFiltering = (data) => {
  const filterers = {
    wordContains: "word",
    wordLengthMatches: (value, filter) => {
      const [minLength, maxLength] = filter;
      return value.word.length >= minLength && value.word.length <= maxLength;
    },
    typeMatches: (value, filter) => {
      switch (filter) {
        case "Adjective":
          return value.type === "adjective";
        case "Noun":
          return value.type === "noun";
        case "Custom Word":
          return value.isCustomWord;
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
