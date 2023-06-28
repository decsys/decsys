import { Flex, HStack, Input, Text } from "@chakra-ui/react";
import SortPanel from "components/shared/SortPanel";

const WordlistSortingAndFilteringPanel = ({
  data,
  sorting,
  onSort,
  filter,
  setFilter,
}) => {
  return (
    <Flex alignItems="center">
      <Text mr=".5em" display={{ xs: "none", md: "inline" }}>
        Sort by:
      </Text>
      {Object.keys(data).length && (
        <HStack>
          <SortPanel
            state={sorting}
            onSortButtonClick={onSort}
            keys={[
              ["Word", "word"],
              ["Type", "type"],
              ["Active", "isExcludedBuiltin"],
            ]}
          />
          <Input
            flex={1}
            variant="flushed"
            placeholder="Filter by Name"
            size="sm"
            value={filter}
            onChange={({ target: { value } }) => setFilter(value)}
          />
        </HStack>
      )}
    </Flex>
  );
};

export default WordlistSortingAndFilteringPanel;
