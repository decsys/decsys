import SurveyCard from "./SurveyCard";
import { Stack, Box, Select } from "@chakra-ui/react";
import { useSortingAndFiltering } from "components/shared/SortPanel";
import SurveysSortingAndFiltering from "./SurveysSortingAndFiltering";
import { SurveyProvider } from "../../../contexts/Survey";
import { useEffect, useState } from "react";
import PaginationControls from "./Pagination/PaginationControls";
import { useNavigate, useParams } from "@reach/router";

const SurveysList = ({ surveys }) => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("hideArchived");

  const getQueryParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const page = parseInt(searchParams.get("page"), 10) || 1;
    const limit = parseInt(searchParams.get("limit"), 10) || 10;
    return { page, limit };
  };

  const { page, limit } = getQueryParams();
  const [currentPage, setCurrentPage] = useState(page - 1);
  const [itemLimit, setItemLimit] = useState(limit);

  const filteredSurveys = Object.values(surveys).filter((survey) => {
    if (filter === "hideArchived") {
      return !survey.archivedDate;
    } else if (filter === "onlyArchived") {
      return survey.archivedDate;
    }
    return true;
  });

  const sortingAndFiltering = useSortingAndFiltering(filteredSurveys);
  const totalItems = sortingAndFiltering.surveyList.length;

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

  return (
    <Stack mt={2}>
      <Box py={4}>
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

      <Select
        w="200px"
        onChange={(e) => setFilter(e.target.value)}
        defaultValue="hideArchived"
      >
        <option value="hideArchived">Hide Archived</option>
        <option value="onlyArchived">Show Only Archived</option>
        <option value="showAll">Show All</option>
      </Select>

      <PaginationControls
        currentPage={currentPage}
        itemLimit={itemLimit}
        setItemLimit={(newLimit) => {
          setItemLimit(newLimit);
          setCurrentPage(0);
        }}
        setCurrentPage={setCurrentPage}
        totalItems={totalItems}
      />
    </Stack>
  );
};

export default SurveysList;
