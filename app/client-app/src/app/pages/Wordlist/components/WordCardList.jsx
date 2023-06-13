import { WordCard } from "./WordCard";
import { getFilteredWordList } from "./helpers";
import { Box, Stack } from "@chakra-ui/react";

export const WordCardList = ({ adjectives, nouns, excludedWords }) => {
  const excludedWordsDict = excludedWords.reduce((dict, word) => {
    dict[word] = true;
    return dict;
  }, {});

  const adjectiveCards = getFilteredWordList(
    adjectives,
    excludedWordsDict,
    "adjective"
  );
  const nounCards = getFilteredWordList(nouns, excludedWordsDict, "noun");

  const allCards = [...adjectiveCards, ...nounCards];
  return (
    <>
      {allCards.map((card, index) => (
        <Stack
          borderColor="gray.200"
          boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px;"
        >
          <WordCard key={index} {...card} />
        </Stack>
      ))}
    </>
  );
};
