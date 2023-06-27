import { WordCard } from "./WordCard";
import { Stack, Box } from "@chakra-ui/react";
import { useWordlistSortingAndFiltering } from "./useWordlistSortingAndFiltering";
import WordlistSortingAndFilteringPanel from "../WordlistSortingAndFiltering";

export const WordCardList = ({ cards }) => {
  const { sorting, onSort, outputList } = useWordlistSortingAndFiltering(cards);
  return (
    <Stack mt={2}>
      <WordlistSortingAndFilteringPanel
        data={cards}
        sorting={sorting}
        onSort={onSort}
      />
      <Stack
        borderColor="gray.200"
        boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px;"
      >
        {outputList.map((card, index) => (
          <WordCard key={index} {...card} />
        ))}
      </Stack>
    </Stack>
  );
};
