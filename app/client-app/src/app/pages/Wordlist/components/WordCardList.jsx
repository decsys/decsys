import { WordCard } from "./WordCard";
import { Stack } from "@chakra-ui/react";
import WordlistSortingAndFilteringPanel from "../WordlistSortingAndFiltering";

export const WordCardList = ({
  cards,
  sorting,
  onSort,
  toggleExclude,
  outputList,
}) => (
  <Stack mt={2}>
    <WordlistSortingAndFilteringPanel
      data={cards}
      sorting={sorting}
      onSort={onSort}
    />
    <Stack borderColor="gray.200" boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px;">
      {outputList.map((card, index) => (
        <WordCard key={index} {...card} onToggleExclude={toggleExclude} />
      ))}
    </Stack>
  </Stack>
);
