import { useState, useEffect } from "react";
import { getSortedLookup, getFilteredLookup } from "./utils";

export const useAllowLaunch = surveys => {
  const [allowLaunch, setAllowLaunch] = useState(false);
  useEffect(
    () =>
      setAllowLaunch(
        Object.keys(surveys).filter(id => surveys[id].activeInstanceId != null)
          .length === 0
      ),
    [surveys]
  );
  return allowLaunch;
};

export const useSortingAndFiltering = surveys => {
  const [sorting, setSorting] = useState({ key: "name", name: true });
  const [sortedSurveys, setSortedSurveys] = useState([]);
  const [filter, setFilter] = useState("");
  const [filteredSurveys, setFilteredSurveys] = useState([]);

  // update the sorted list appropriately
  useEffect(() => {
    setSortedSurveys(
      getSortedLookup(surveys, sorting.key, sorting[sorting.key])
    );
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
    surveyList: filteredSurveys
  };
};
