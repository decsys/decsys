import { useSortingAndFiltering } from "hooks/useSortingAndFiltering";

export const useWordlistSortingAndFiltering = (data) =>
  useSortingAndFiltering(data, "word", {
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
