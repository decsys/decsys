import { Flex, Input, Text } from "@chakra-ui/react";
import SortPanel from "components/shared/SortPanel";

const SurveysSortingAndFiltering = ({
  sorting,
  setSorting,
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
    </Flex>
  );
};

export default SurveysSortingAndFiltering;
