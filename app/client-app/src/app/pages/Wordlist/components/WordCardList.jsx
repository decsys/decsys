import { WordCard } from "./WordCard";
import { Stack, Box } from "@chakra-ui/react";
import { useWordlistSortingAndFiltering } from "./useWordlistSortingAndFiltering";
import WordlistSortingAndFiltering from "../WordlistSortingAndFiltering";

export const WordCardList = ({ cards }) => {
  const sortingAndFiltering = useWordlistSortingAndFiltering(cards);

  return (
    <Stack mt={2}>
      <Box py={4}>
        <WordlistSortingAndFiltering {...sortingAndFiltering} />
      </Box>

      <Stack
        borderColor="gray.200"
        boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px;"
      >
        {sortingAndFiltering.wordCardList.map((card, index) => (
          <WordCard key={index} {...card} />
        ))}
      </Stack>
    </Stack>
  );
};
