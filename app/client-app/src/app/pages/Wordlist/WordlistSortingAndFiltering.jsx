import { Flex, Text } from "@chakra-ui/react";
import SortPanel from "components/shared/SortPanel";

const WordlistSortingAndFiltering = ({ sorting, setSorting }) => {
  const handleSort = (key) => {
    setSorting({
      ...sorting,
      key,
      [key]: sorting.key === key ? !sorting[key] : sorting[key],
    });
  };

  return (
    <Flex alignItems="center">
      <Text mr=".5em" display={{ xs: "none", md: "inline" }}>
        Sort by:
      </Text>
      <SortPanel
        state={sorting}
        onSortButtonClick={handleSort}
        keys={["word", "type"]}
      />
    </Flex>
  );
};

export default WordlistSortingAndFiltering;
