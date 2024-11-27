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

const SurveysList = ({ surveys }) => {
  const navigate = useNavigate();
  const getQueryParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const page = parseInt(searchParams.get("page"), 10) || 1;
    const limit = parseInt(searchParams.get("limit"), 10) || 10;
    return { page, limit };
  };

  const { page, limit } = getQueryParams();
  const [currentPage, setCurrentPage] = useState(page - 1);
  const [itemLimit, setItemLimit] = useState(limit);
  const [filterType, setFilterType] = useState("unarchived");
  const [filteredSurveys, setFilteredSurveys] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data: surveysFromApi, mutate: refetchSurveys } = useFilteredSurveys(
    debouncedSearchTerm,
    "all"
  );

  const sortingAndFiltering = useSortingAndFiltering(filteredSurveys);
  const totalItems = sortingAndFiltering.surveyList.length;

  useEffect(() => {
    if (surveysFromApi) {
      let updatedSurveys = surveysFromApi;
      if (filterType === "archived") {
        updatedSurveys = surveysFromApi.filter(
          (survey) => survey.archivedDate !== null
        );
      } else if (filterType === "unarchived") {
        updatedSurveys = surveysFromApi.filter(
          (survey) => survey.archivedDate == null
        );
      }
      setFilteredSurveys(updatedSurveys);
    }
  }, [surveysFromApi, filterType]);

  useEffect(() => {
    refetchSurveys();
  }, [debouncedSearchTerm, refetchSurveys]);

  useEffect(() => {
    const params = new URLSearchParams({
      page: currentPage + 1,
      limit: itemLimit,
    });
    navigate(`/admin/surveys?${params.toString()}`, { replace: true });
  }, [currentPage, itemLimit, navigate]);

  const currentSurveys = sortingAndFiltering.surveyList.slice(
    currentPage * itemLimit,
    (currentPage + 1) * itemLimit
  );

  const handleFilterChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSurveyFilterChange = (value) => {
    setFilterType(value);
    setCurrentPage(0); // Reset to the first page when filter changes
  };

  const hasArchivedDate = filteredSurveys.some(
    (survey) => survey.archivedDate !== null
  );

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
        {currentSurveys.length > 0 ? (
          currentSurveys.map(
            (survey) =>
              survey.id &&
              surveys[survey.id] && (
                <SurveyProvider key={survey.id} value={surveys[survey.id]}>
                  <SurveyCard />
                </SurveyProvider>
              )
          )
        ) : (
          <Flex p={5}>
            <Text>No surveys found matching your criteria.</Text>
          </Flex>
        )}
      </Stack>

      {/* Pagination Controls */}
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
