import SurveyCard from "./SurveyCard";
import { Stack, Box, Input, Flex, Text } from "@chakra-ui/react";
import { SurveyProvider } from "../../../contexts/Survey";
import { useEffect, useState } from "react";
import FilterControls from "./Pagination/PaginationControls";
import { useDebounce } from "app/pages/Editor/components/Helpers/useDebounce";
import { useFilteredSurveys } from "api/surveys";
import SortPanel from "components/shared/SortPanel";
import { useLocation, navigate } from "@reach/router";

const SurveysList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [searchTerm, setSearchTerm] = useState(queryParams.get("search") || "");
  const [filterType, setFilterType] = useState(
    queryParams.get("filter") || "unarchived"
  );
  const [sortBy, setSortBy] = useState(queryParams.get("sort") || "name");
  const [direction, setDirection] = useState(
    queryParams.get("direction") || "up"
  );
  const [pageIndex, setPageIndex] = useState(
    parseInt(queryParams.get("page") || "0")
  );
  const [pageSize, setPageSize] = useState(
    parseInt(queryParams.get("size") || "10")
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data: surveysList, mutate: refetchSurveys } = useFilteredSurveys(
    debouncedSearchTerm,
    filterType,
    sortBy,
    direction,
    pageIndex,
    pageSize
  );

  const totalItems = surveysList.totalCount;
  const totalPages = Math.ceil(totalItems / pageSize);

  useEffect(() => {
    refetchSurveys();
  }, [
    debouncedSearchTerm,
    filterType,
    sortBy,
    direction,
    pageIndex,
    pageSize,
    refetchSurveys,
  ]);

  useEffect(() => {
    setPageIndex(0); // reset to first page whenever filter is changed
  }, [debouncedSearchTerm, filterType, sortBy, direction]);

  useEffect(() => {
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.set("search", searchTerm);
    if (filterType) searchParams.set("filter", filterType);
    if (sortBy) searchParams.set("sort", sortBy);
    searchParams.set("direction", direction);
    searchParams.set("page", (pageIndex + 1).toString());
    searchParams.set("size", pageSize.toString());

    navigate(`?${searchParams.toString()}`, { replace: true });
  }, [searchTerm, filterType, sortBy, direction, pageIndex, pageSize]);

  const handleFilterChange = (e) => setSearchTerm(e.target.value);
  const handleSurveyFilterChange = (value) => {
    setFilterType(value);
  };

  const handleSortButtonClick = (key) => {
    if (sortBy === key) {
      setDirection((prev) => (prev === "up" ? "down" : "up"));
    } else {
      setSortBy(key);
      setDirection("up");
    }
    setPageIndex(0);
  };

  const handlePageChange = (newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPageIndex(0);
  };

  return (
    <Stack mt={2}>
      <Box pb={4}>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <Text mr=".5em" display={{ xs: "none", md: "inline" }}>
              Sort by:
            </Text>
            <SortPanel
              state={{ key: sortBy, [sortBy]: direction === "up" }}
              keys={[
                "Active",
                ["Run Count", "runCount"],
                "Name",
                ...(filterType !== "unarchived"
                  ? [["Archived", "archived"]]
                  : []),
              ]}
              onSortButtonClick={handleSortButtonClick}
            />
          </Flex>
          <Input
            placeholder="Filter"
            size="sm"
            maxW="200px"
            value={searchTerm}
            onChange={handleFilterChange}
          />
        </Flex>
      </Box>
      <Stack boxShadow="callout" spacing={0}>
        {surveysList.surveys &&
          surveysList.surveys.map((survey) => (
            <SurveyProvider key={survey.id} value={survey}>
              <SurveyCard refetchSurveys={refetchSurveys} />
            </SurveyProvider>
          ))}
      </Stack>
      <FilterControls
        totalItems={totalItems}
        totalPages={totalPages}
        pageIndex={pageIndex}
        pageSize={pageSize}
        handlePageChange={handlePageChange}
        handlePageSizeChange={handlePageSizeChange}
        handleSurveyFilterChange={handleSurveyFilterChange}
        filterType={filterType}
      />
    </Stack>
  );
};

export default SurveysList;
