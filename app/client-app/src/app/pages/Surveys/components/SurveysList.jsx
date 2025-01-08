import SurveyCard from "./SurveyCard";
import { Stack, Box, Input, Flex, Text } from "@chakra-ui/react";
import { SurveyProvider } from "../../../contexts/Survey";
import FilterControls from "./Pagination/PaginationControls";
import SortPanel from "components/shared/SortPanel";
import useSurveySessionState from "hooks/useSurveySessionState";

const SurveysList = ({
  surveys,
  totalCount,
  pageSize,
  setPageSize,
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  sortBy,
  setSortBy,
  direction,
  setDirection,
  pageIndex,
  setPageIndex,
  mutateSurveys,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  useSurveySessionState({
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
  });

  // Handle filter search
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
        {surveys &&
          surveys.map((survey) => (
            <SurveyProvider key={survey.id} value={survey}>
              <SurveyCard mutateSurveys={mutateSurveys} />
            </SurveyProvider>
          ))}
      </Stack>
      <FilterControls
        totalItems={totalCount}
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
