import { useSortingAndFiltering } from "components/shared/SortPanel";

export const useWordlistSortingAndFiltering = (wordList) => {
  const sortingAndFiltering = useSortingAndFiltering(wordList);

  return {
    wordCardList: sortingAndFiltering.surveyList,
    sorting: sortingAndFiltering.sorting,
    setSorting: sortingAndFiltering.setSorting,
    filter: sortingAndFiltering.filter,
    setFilter: sortingAndFiltering.setFilter,
  };
};
