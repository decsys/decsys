import SurveyCard from "./SurveyCard";
import { Stack, Box, Input, Flex, Text } from "@chakra-ui/react";
import { SurveyProvider } from "../../../contexts/Survey";
import { useEffect, useState } from "react";
import PaginationControls from "./Pagination/PaginationControls";
import { useDebounce } from "app/pages/Editor/components/Helpers/useDebounce";
import { useFilteredSurveys } from "api/surveys";
import SortPanel from "components/shared/SortPanel";

const SurveysList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("unarchived");
  const [sortBy, setSortBy] = useState("name");
  const [direction, setDirection] = useState("up");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data: surveysList, mutate: refetchSurveys } = useFilteredSurveys(
    debouncedSearchTerm,
    filterType,
    sortBy,
    direction
  );

  const totalItems = surveysList.totalCount;

  useEffect(() => {
    refetchSurveys();
  }, [debouncedSearchTerm, refetchSurveys]);

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
  };

  console.log(filterType);

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
                ...(filterType === "all" ? [["Archived", "archived"]] : []),
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
      <PaginationControls
        totalItems={totalItems}
        handleSurveyFilterChange={handleSurveyFilterChange}
        filterType={filterType}
      />
    </Stack>
  );
};

export default SurveysList;
