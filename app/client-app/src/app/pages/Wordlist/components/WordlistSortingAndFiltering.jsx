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
      {Object.keys(data).length > 0 && (
        <VStack>
          <HStack spacing="0" pb={2.5}>
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
            placeholder="Search by Name"
            size="sm"
            value={filter}
            onChange={({ target: { value } }) => setFilter(value)}
          />
        </VStack>
      )}
    </Flex>
  );
};

export default WordlistSortingAndFilteringPanel;
