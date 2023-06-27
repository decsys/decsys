import { useSortingAndFiltering } from "hooks/useSortingAndFiltering";

export const useWordlistSortingAndFiltering = (data, storageKey) =>
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
    },
    storageKey: "wordlist",
  });
