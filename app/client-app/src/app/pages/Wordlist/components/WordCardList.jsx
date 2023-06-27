import { WordCard } from "./WordCard";
import { Stack, Box } from "@chakra-ui/react";
import { useWordlistSortingAndFiltering } from "./useWordlistSortingAndFiltering";
import WordlistSortingAndFilteringPanel from "../WordlistSortingAndFiltering";
import { useState } from "react";
import { fetchWordList } from "api/wordlist";
import { excludeBuiltinWords } from "api/wordlist";
import { includeBuiltinWords } from "api/wordlist";

export const WordCardList = ({ cards }) => {
  const [wordCards, setWordCards] = useState(cards);
  const { sorting, onSort, outputList } =
    useWordlistSortingAndFiltering(wordCards);

  const toggleExclude = async (word, type, isExcludedBuiltin) => {
    const data = await fetchWordList();
    const id = data.id;

    if (isExcludedBuiltin) {
      await includeBuiltinWords(id, type, word);
    } else {
      await excludeBuiltinWords(id, type, word);
    }

    setWordCards((prevCards) =>
      prevCards.map((card) =>
        card.word === word
          ? { ...card, isExcludedBuiltin: !isExcludedBuiltin }
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
          <WordCard key={index} {...card} onToggleExclude={toggleExclude} />
        ))}
      </Stack>
    </Stack>
  );
};
``;
