import SurveyCard from "./SurveyCard";
import {
  Stack,
  Box,
  Select,
  Text,
  HStack,
  Input,
  Flex,
  Button,
} from "@chakra-ui/react";
import { useSortingAndFiltering } from "components/shared/SortPanel";
import SurveysSortingAndFiltering from "./SurveysSortingAndFiltering";
import { SurveyProvider } from "../../../contexts/Survey";
import { useEffect, useState } from "react";
import PaginationControls from "./Pagination/PaginationControls";
import { useNavigate, useParams } from "@reach/router";
import { useDebounce } from "app/pages/Editor/components/Helpers/useDebounce";
import { useFilteredSurveys } from "api/surveys";
import { useSurveyPagination } from "hooks/useSurveyPagination";
import { useFilterSurveys } from "hooks/useFilterSurveys";

const SurveysList = ({ surveys }) => {
  const { page, limit } = getQueryParams();

  const { currentPage, setCurrentPage, itemLimit, setItemLimit } =
    useSurveyPagination(page - 1, limit);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data: surveysFromApi, mutate: refetchSurveys } = useFilteredSurveys(
    debouncedSearchTerm,
    "all"
  );
  const [filterType, setFilterType] = useState("unarchived");
  const filteredSurveys = useFilterSurveys(surveysFromApi, filterType);
  const sortingAndFiltering = useSortingAndFiltering(filteredSurveys);

  const totalItems = sortingAndFiltering.surveyList.length;
  const currentSurveys = sortingAndFiltering.surveyList.slice(
    currentPage * itemLimit,
    (currentPage + 1) * itemLimit
  );
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

  return (
    <Stack mt={2}>
      <Box pb={4}>
        <Flex alignItems="center" justifyContent="space-between">
          <SurveysSortingAndFiltering
            {...sortingAndFiltering}
            hasArchivedDate={hasArchivedDate}
          />
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
        {currentSurveys.map(
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
