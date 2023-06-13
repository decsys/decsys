import { WordCard } from "./WordCard";
import { getFilteredWordList } from "./helpers";
import { Flex } from "@chakra-ui/react";

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
        <Flex
          borderTopRadius={5}
          align="center"
          justify="space-between"
          role="group"
        >
          <WordCard key={index} {...card} />
        </Flex>
      ))}
    </>
  );
};
