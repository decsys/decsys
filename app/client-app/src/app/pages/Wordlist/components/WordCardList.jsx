import { WordCard } from "./WordCard";
import { Stack, Box } from "@chakra-ui/react";
import { useWordlistSortingAndFiltering } from "./useWordlistSortingAndFiltering";
import WordlistSortingAndFilteringPanel from "../WordlistSortingAndFiltering";
import { useState } from "react";

export const WordCardList = ({ cards }) => {
  const [wordCards, setWordCards] = useState(cards);
  const { sorting, onSort, outputList } =
    useWordlistSortingAndFiltering(wordCards);

  const handleIsExcludedBuiltin = (word, newIsExcludedBuiltin) => {
    setWordCards((prevCards) =>
      prevCards.map((card) =>
        card.word === word
          ? { ...card, isExcludedBuiltin: newIsExcludedBuiltin }
          : card
      )
    );
  };

  return (
    <Stack mt={2}>
      <WordlistSortingAndFilteringPanel
        data={wordCards}
        sorting={sorting}
        onSort={onSort}
      />
      <Stack
        borderColor="gray.200"
        boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px;"
      >
        {outputList.map((card, index) => (
          <WordCard
            key={index}
            {...card}
            onIsExcludedBuiltinChange={handleIsExcludedBuiltin}
          />
        ))}
      </Stack>
    </Stack>
  );
};
