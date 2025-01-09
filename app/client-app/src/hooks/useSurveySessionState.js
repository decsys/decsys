import { useEffect } from "react";
import { navigate } from "@reach/router";

// Custom hook to manage survey sorting and filtering state with sessionStorage and sync it with URL query parameters.
const useSurveySessionState = ({
  pageSize,
  setPageSize,
  filterType,
  setFilterType,
  sortBy,
  setSortBy,
  direction,
  setDirection,
  pageIndex,
  setPageIndex,
}) => {
  useEffect(() => {
    const savedPageSize = sessionStorage.getItem("pageSize");
    const savedFilterType = sessionStorage.getItem("filterType");
    const savedSortBy = sessionStorage.getItem("sortBy");
    const savedDirection = sessionStorage.getItem("direction");
    const savedPageIndex = sessionStorage.getItem("pageIndex");

    if (savedPageSize) setPageSize(parseInt(savedPageSize, 10));
    if (savedFilterType) setFilterType(savedFilterType);
    if (savedSortBy) setSortBy(savedSortBy);
    if (savedDirection) setDirection(savedDirection);
    if (savedPageIndex) setPageIndex(parseInt(savedPageIndex, 10));
  }, [setPageSize, setFilterType, setSortBy, setDirection, setPageIndex]);

  useEffect(() => {
    sessionStorage.setItem("pageSize", pageSize);
    sessionStorage.setItem("filterType", filterType);
    sessionStorage.setItem("sortBy", sortBy);
    sessionStorage.setItem("direction", direction);
    sessionStorage.setItem("pageIndex", pageIndex);
  }, [pageSize, filterType, sortBy, direction, pageIndex]);

  useEffect(() => {
    const searchParams = new URLSearchParams();
    if (filterType) searchParams.set("filter", filterType);
    if (sortBy) searchParams.set("sort", sortBy);
    searchParams.set("direction", direction);
    searchParams.set("page", (pageIndex + 1).toString());
    searchParams.set("size", pageSize.toString());
    navigate(`?${searchParams.toString()}`, { replace: true });
  }, [filterType, sortBy, direction, pageIndex, pageSize]);
};

export default useSurveySessionState;
