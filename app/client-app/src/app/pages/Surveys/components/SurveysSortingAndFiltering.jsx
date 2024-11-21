import { Flex, Input, Text } from "@chakra-ui/react";
import SortPanel from "components/shared/SortPanel";

const SurveysSortingAndFiltering = ({
  sorting,
  setSorting,
  filter,
  setFilter,
  hasArchivedDate,
}) => {
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
        keys={[
          "Active",
          ["Run Count", "runCount"],
          "Name",
          ...(hasArchivedDate ? [["Archived", "archivedDate"]] : []),
        ]}
      />

      <Flex ml="auto">
        <Input
          placeholder="Filter"
          size="sm"
          value={filter}
          onChange={({ target }) => setFilter(target.value)}
        />
      </Flex>
    </Flex>
  );
};

export default SurveysSortingAndFiltering;
