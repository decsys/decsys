import { Flex, VStack, Input, Text, HStack, Box } from "@chakra-ui/react";
import SortPanel from "components/shared/SortPanel";

const WordlistSortingAndFilteringPanel = ({
  data,
  sorting,
  onSort,
  filterConfig,
  setFilter,
  isDefaultWordlist,
}) => {
  const sortingKeys = [
    ["Word", "word"],
    ["Type", "type"],
  ];

  if (!isDefaultWordlist) {
    sortingKeys.push(["Active", "isExcludedBuiltin"]);
  }
  return (
    <Flex alignItems="center" flexDirection="column">
      {Object.keys(data).length > 0 && (
        <VStack>
          <HStack spacing="0" pb={2.5}>
            <Text mr=".5em" display={{ xs: "none", md: "inline" }}>
              Sort by:
            </Text>
            <SortPanel
              state={sorting}
              onSortButtonClick={onSort}
              keys={sortingKeys}
            />
          </HStack>
          <Input
            placeholder="Search by Word"
            size="sm"
            value={filterConfig.wordContains}
            onChange={({ target: { value } }) =>
              setFilter("wordContains", value)
            }
          />
        </VStack>
      )}
    </Flex>
  );
};

export default WordlistSortingAndFilteringPanel;
