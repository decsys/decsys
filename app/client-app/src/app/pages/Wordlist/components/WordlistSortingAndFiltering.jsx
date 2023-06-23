const { Flex, Text } = require("@chakra-ui/react");
const { default: SortPanel } = require("components/shared/SortPanel");

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
        keys={["Active", ["Run Count", "runCount"], "Name"]}
      />
    </Flex>
  );
};

export default WordlistSortingAndFiltering;
