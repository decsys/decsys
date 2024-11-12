import SurveyCard from "./SurveyCard";
import { Stack, Box } from "@chakra-ui/react";
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

  const sortingAndFiltering = useSortingAndFiltering(surveys);
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
      />
    </Stack>
  );
};

export default SurveysList;
