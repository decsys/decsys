import SurveyCard from "./SurveyCard";
import { Stack, Box, Button } from "@chakra-ui/react";
import { useSortingAndFiltering } from "components/shared/SortPanel";
import SurveysSortingAndFiltering from "./SurveysSortingAndFiltering";
import { SurveyProvider } from "../../../contexts/Survey";
import { useState } from "react";

const SurveysList = ({ surveys }) => {
  const sortingAndFiltering = useSortingAndFiltering(surveys);

  const [currentPage, setCurrentPage] = useState(0);
  const itemLimit = 4; // Number of surveys per page

  const numPages = Math.ceil(sortingAndFiltering.surveyList.length / itemLimit);

  const currentSurveys = sortingAndFiltering.surveyList.slice(
    currentPage * itemLimit,
    (currentPage + 1) * itemLimit
  );
  const setPage = (newPage) => {
    setCurrentPage(newPage);
  };

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
      <Box>
        <Button
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage >= numPages - 1}
        >
          Next
        </Button>
        <Box>
          Page {currentPage + 1} of {numPages}
        </Box>
      </Box>
    </Stack>
  );
};

export default SurveysList;
