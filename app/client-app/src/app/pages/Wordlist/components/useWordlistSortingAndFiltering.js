import { useSortingAndFiltering } from "components/shared/SortPanel";

export const useWordlistSortingAndFiltering = (cards) => {
  const sortingAndFiltering = useSortingAndFiltering(cards);

  return {
    wordCardList: sortingAndFiltering.surveyList,
    sorting: sortingAndFiltering.sorting,
    setSorting: sortingAndFiltering.setSorting,
  };
};
