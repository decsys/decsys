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

const FilterControls = ({
  totalItems,
  totalPages,
  pageIndex,
  pageSize,
  handlePageChange,
  handlePageSizeChange,
  handleSurveyFilterChange,
  filterType,
}) => {
  useEffect(() => {
    if (totalPages > 0 && pageIndex >= totalPages) {
      handlePageChange(totalPages - 1);
    } else if (totalPages > 0 && pageIndex < 0) {
      handlePageChange(0);
    }
  }, [pageIndex, totalPages, handlePageChange]);

  const setPage = (newPage) => {
    handlePageChange(newPage);
  };

  const generatePageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      if (pageIndex < 2) {
        pages.push(0, 1, 2, "...", totalPages - 1);
      } else if (pageIndex >= totalPages - 3) {
        pages.push(
          0,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1
        );
      } else {
        pages.push(
          0,
          "...",
          pageIndex - 1,
          pageIndex,
          pageIndex + 1,
          "...",
          totalPages - 1
        );
      }
    }
    return pages;
  };

  return (
    <HStack spacing={4} py={2} justifyContent="space-between">
      {handleSurveyFilterChange && (
        <HStack justifyContent="end">
          <Select
            onChange={(e) => handleSurveyFilterChange(e.target.value)}
            value={filterType}
            w="250px"
          >
            <option value="unarchived">Hide Archived Surveys</option>
            <option value="all">Show All Surveys</option>
            <option value="archived">Only Archived Surveys</option>
          </Select>
        </HStack>
      )}
      <HStack>
        {handlePageSizeChange && (
          <HStack>
            <Text>Surveys Per Page:</Text>
            <Select
              w="80px"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
            >
              {[5, 10, 20, 30, 50, 75, 100].map((limit) => (
                <option key={limit} value={limit}>
                  {limit}
                </option>
              ))}
            </Select>
          </HStack>
        )}
        <Flex alignItems="center" justifyContent="center">
          <IconButton
            icon={<FaChevronLeft />}
            onClick={() => setPage(pageIndex - 1)}
            isDisabled={pageIndex === 0}
            aria-label="Previous Page"
          />
          {generatePageNumbers().map((page, index) =>
            typeof page === "number" ? (
              <Button
                key={index}
                onClick={() => setPage(page)}
                isActive={page === pageIndex}
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
            onClick={() => setPage(pageIndex + 1)}
            isDisabled={pageIndex >= totalPages - 1}
            aria-label="Next Page"
          />
        </Flex>
        <Text>
          Page {pageIndex + 1} of {totalPages}
        </Text>
      </HStack>
    </HStack>
  );
};

export default FilterControls;
