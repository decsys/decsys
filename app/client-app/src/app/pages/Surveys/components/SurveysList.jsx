import SurveyCard from "./SurveyCard";
import { Stack, Box, Input, Flex, Text } from "@chakra-ui/react";
import { SurveyProvider } from "../../../contexts/Survey";
import { useEffect, useState } from "react";
import PaginationControls from "./Pagination/PaginationControls";
import { useDebounce } from "app/pages/Editor/components/Helpers/useDebounce";
import { useFilteredSurveys } from "api/surveys";
import { useSurveyPagination } from "hooks/useSurveyPagination";
import { useFilterSurveys } from "hooks/useFilterSurveys";
import SortPanel from "components/shared/SortPanel";

const SurveysList = ({ surveys }) => {
  const { page, limit } = getQueryParams();

  const { currentPage, setCurrentPage, itemLimit, setItemLimit } =
    useSurveyPagination(page - 1, limit);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [filterType, setFilterType] = useState("unarchived");
  const [sortBy, setSortBy] = useState("name");
  const [direction, setDirection] = useState("up");
  const { data: surveysFromApi, mutate: refetchSurveys } = useFilteredSurveys(
    debouncedSearchTerm,
    filterType,
    sortBy,
    direction
  );
  const filteredSurveys = useFilterSurveys(surveysFromApi, filterType);

  const totalItems = surveysFromApi.length;
  const hasArchivedDate = filteredSurveys.some(
    (survey) => survey.archivedDate !== null
  );
  useEffect(() => {
    refetchSurveys();
  }, [debouncedSearchTerm, refetchSurveys]);

  const handleFilterChange = (e) => setSearchTerm(e.target.value);
  const handleSurveyFilterChange = (value) => {
    setFilterType(value);
    setCurrentPage(0); // Reset to first page when filter changes
  };

  const handleSortButtonClick = (key) => {
    if (sortBy === key) {
      setDirection((prev) => (prev === "up" ? "down" : "up"));
    } else {
      setSortBy(key);
      setDirection("up");
    }
    setCurrentPage(0);
  };

  console.log(totalItems);
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
                ...(hasArchivedDate ? [["Archived", "archived"]] : []),
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
        {surveysFromApi.map(
          (survey) =>
            survey.id &&
            surveys[survey.id] && (
              <SurveyProvider key={survey.id} value={surveys[survey.id]}>
                <SurveyCard />
              </SurveyProvider>
            )
        )}
      </Stack>
      <PaginationControls
        currentPage={currentPage}
        itemLimit={itemLimit}
        setItemLimit={(newLimit) => {
          setItemLimit(newLimit);
          setCurrentPage(0); // Reset to first page when limit changes
        }}
        setCurrentPage={setCurrentPage}
        totalItems={totalItems}
        handleSurveyFilterChange={handleSurveyFilterChange}
        filterType={filterType}
      />
    </Stack>
  );
};

export default SurveysList;

function getQueryParams() {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    page: parseInt(searchParams.get("page"), 10) || 1,
    limit: parseInt(searchParams.get("limit"), 10) || 10,
  };
}
