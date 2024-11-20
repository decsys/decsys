import SurveyCard from "./SurveyCard";
import { Stack, Box, Select, Text, HStack } from "@chakra-ui/react";
import { useSortingAndFiltering } from "components/shared/SortPanel";
import SurveysSortingAndFiltering from "./SurveysSortingAndFiltering";
import { SurveyProvider } from "../../../contexts/Survey";
import { useEffect, useState } from "react";
import PaginationControls from "./Pagination/PaginationControls";
import { useNavigate, useParams } from "@reach/router";

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
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [filterType, setFilterType] = useState("active");

  const sortingAndFiltering = useSortingAndFiltering(filteredSurveys);
  const totalItems = sortingAndFiltering.surveyList.length;

  useEffect(() => {
    let updatedSurveys = [];
    if (filterType === "archived") {
      updatedSurveys = Object.values(surveys).filter(
        (survey) => survey.archivedDate !== null
      );
    } else if (filterType === "all") {
      updatedSurveys = Object.values(surveys);
    } else if (filterType === "active") {
      updatedSurveys = Object.values(surveys).filter(
        (survey) => survey.archivedDate == null
      );
    }
    setFilteredSurveys(updatedSurveys);
  }, [surveys, filterType]);

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

  const handleSurveyFilterChange = (value) => {
    setFilterType(value);
    setCurrentPage(0); // Reset to the first page when filter changes
  };

  return (
    <Stack mt={2}>
      <Box pb={4}>
        <SurveysSortingAndFiltering {...sortingAndFiltering} />
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
