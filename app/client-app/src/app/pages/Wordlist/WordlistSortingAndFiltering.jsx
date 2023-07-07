import { Flex, VStack, Input, Text, HStack, Box } from "@chakra-ui/react";
import SortPanel from "components/shared/SortPanel";

const WordlistSortingAndFilteringPanel = ({
  data,
  sorting,
  onSort,
  filter,
  setFilter,
}) => {
  return (
    <Flex alignItems="center" flexDirection="column">
      {Object.keys(data).length && (
        <VStack width="100%">
          <Box>
            <HStack justifyContent="space-between">
              <Text mr=".5em" display={{ xs: "none", md: "inline" }}>
                Sort by:
              </Text>
              <SortPanel
                state={sorting}
                onSortButtonClick={onSort}
                keys={[
                  ["Word", "word"],
                  ["Type", "type"],
                  ["Active", "isExcludedBuiltin"],
                ]}
              />
            </HStack>
            <Input
              variant="flushed"
              placeholder="Search by Name"
              size="sm"
              value={filter}
              onChange={({ target: { value } }) => setFilter(value)}
            />
          </Box>
        </VStack>
      )}
    </Flex>
  );
};

export default WordlistSortingAndFilteringPanel;
