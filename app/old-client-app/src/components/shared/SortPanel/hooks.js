import { useState, useEffect } from "react";
import { getSortedLookup, getFilteredLookup } from "./helpers";

const storageKey = "surveys.sorting";

export const useSortingAndFiltering = (surveys) => {
  const [sorting, setSorting] = useState(
    JSON.parse(localStorage.getItem(storageKey)) || {
      key: "name",
      name: true,
    }
  );

  const [sortedSurveys, setSortedSurveys] = useState([]);
  const [filter, setFilter] = useState("");
  const [filteredSurveys, setFilteredSurveys] = useState([]);

  // update the sorted list appropriately
  useEffect(() => {
    setSortedSurveys(
      getSortedLookup(surveys, sorting.key, sorting[sorting.key])
    );
    // also save the new sort for next time
    localStorage.setItem(storageKey, JSON.stringify(sorting));
  }, [surveys, sorting]);

  // update the filtered list appropriately
  useEffect(() => {
    setFilteredSurveys(getFilteredLookup(sortedSurveys, filter));
  }, [filter, sortedSurveys]);

  return {
    sorting,
    setSorting,
    filter,
    setFilter,
    surveyList: filteredSurveys,
  };
};
