import { Flex, HStack, Text } from "@chakra-ui/react";
import SortPanel from "components/shared/SortPanel";

const WordlistSortingAndFilteringPanel = ({ data, sorting, onSort }) => {
  return (
    <Flex alignItems="center">
      <Text mr=".5em" display={{ xs: "none", md: "inline" }}>
        Sort by:
      </Text>
      {Object.keys(data).length && (
        <>
          <SortPanel
            state={sorting}
            onSortButtonClick={onSort}
            keys={[
              ["Word", "word"],
              ["Type", "type"],
              ["Active", "isExcludedBuiltin"],
            ]}
          />
        </>
      )}
    </Flex>
  );
};

export default WordlistSortingAndFilteringPanel;
