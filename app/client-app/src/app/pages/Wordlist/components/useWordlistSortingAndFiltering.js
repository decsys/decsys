import { useSortingAndFiltering } from "./useSortingAndFiltering";

const storageKey = "wordlists.sorting";

export const useWordlistSortingAndFiltering = (wordList) => {
  const initialSorting = JSON.parse(localStorage.getItem(storageKey)) || {
    key: "word",
    word: true,
  };

  const sortingAndFiltering = useSortingAndFiltering(wordList, initialSorting);

  return {
    ...sortingAndFiltering,
    wordList: sortingAndFiltering.surveyList,
  };
};
