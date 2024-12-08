import {
  HStack,
  IconButton,
  Select,
  Button,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PaginationControls = ({
  currentPage,
  itemLimit,
  setItemLimit,
  setCurrentPage,
  totalItems,
  handleSurveyFilterChange,
  filterType,
}) => {
  const numPages = Math.ceil(totalItems / itemLimit);

  useEffect(() => {
    if (numPages > 0 && currentPage >= numPages) {
      setCurrentPage(numPages - 1);
    } else if (numPages > 0 && currentPage < 0) {
      setCurrentPage(0);
    }
  }, [currentPage, numPages, setCurrentPage]);

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
    <HStack spacing={4} py={2} justifyContent="space-between">
      <HStack justifyContent="end">
        <Select
          onChange={(e) => handleSurveyFilterChange(e.target.value)}
          value={filterType} // Bind the current filter to the Select
          w="250px"
        >
          <option value="unarchived">Hide Archived Surveys</option>
          <option value="all">Show All Surveys</option>
          <option value="archived">Only Archived Surveys</option>
        </Select>
      </HStack>
      <HStack>
        <HStack>
          <Text>Surveys Per Page:</Text>
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
  );
};

export default PaginationControls;
