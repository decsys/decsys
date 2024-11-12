import SurveyCard from "./SurveyCard";
import {
  Stack,
  Box,
  Button,
  IconButton,
  Select,
  HStack,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useSortingAndFiltering } from "components/shared/SortPanel";
import SurveysSortingAndFiltering from "./SurveysSortingAndFiltering";
import { SurveyProvider } from "../../../contexts/Survey";
import { useState } from "react";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const SurveysList = ({ surveys }) => {
  const sortingAndFiltering = useSortingAndFiltering(surveys);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemLimit, setItemLimit] = useState(10);

  const numPages = Math.ceil(sortingAndFiltering.surveyList.length / itemLimit);

  const currentSurveys = sortingAndFiltering.surveyList.slice(
    currentPage * itemLimit,
    (currentPage + 1) * itemLimit
  );
  const setPage = (newPage) => {
    setCurrentPage(newPage);
  };

  const generatePageNumbers = () => {
    const pages = [];
    if (numPages <= 5) {
      for (let i = 0; i < numPages; i++) pages.push(i);
    } else {
      if (currentPage < 2) {
        pages.push(0, 1, 2, "...", numPages - 1);
      } else if (currentPage >= numPages - 3) {
        pages.push(
          0,
          "...",
          numPages - 4,
          numPages - 3,
          numPages - 2,
          numPages - 1
        );
      } else {
        pages.push(
          0,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          numPages - 1
        );
      }
    }
    return pages;
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
      <HStack spacing={4} justifyContent="space-between">
        <HStack>
          <Text>Survey Per Page:</Text>
          <Select
            w="80px"
            value={itemLimit}
            onChange={(e) => {
              const newLimit = Number(e.target.value);
              setItemLimit(newLimit);
              setCurrentPage(0); // Reset the page to the first page
            }}
          >
            {[5, 10, 20, 30, 50, 75, 100].map((limit, index) => (
              <option key={index} value={limit}>
                {limit}
              </option>
            ))}
          </Select>
        </HStack>
        <HStack>
          <Flex alignItems="center" justifyContent="center">
            <IconButton
              icon={<FaChevronLeft />}
              onClick={() => setPage(currentPage - 1)}
              isDisabled={currentPage === 0}
              aria-label="Previous Page"
            />

            {generatePageNumbers().map((page, index) =>
              typeof page === "number" ? (
                <Button
                  key={index}
                  onClick={() => setPage(page)}
                  isActive={page === currentPage}
                  mx={1}
                >
                  {page + 1}
                </Button>
              ) : (
                <Box key={index} mx={1}>
                  ...
                </Box>
              )
            )}

            <IconButton
              icon={<FaChevronRight />}
              onClick={() => setPage(currentPage + 1)}
              isDisabled={currentPage >= numPages - 1}
              aria-label="Next Page"
            />
          </Flex>
          <Flex>
            Page {currentPage + 1} of {numPages}
          </Flex>
        </HStack>
      </HStack>
    </Stack>
  );
};
export default SurveysList;
