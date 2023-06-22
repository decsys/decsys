import { getFilteredWordList } from "./helpers";
import { WordCard } from "./WordCard";
import { Stack } from "@chakra-ui/react";
import { toDictionary } from "services/data-structures";

export const WordCardList = ({ adjectives, nouns, excludedBuiltins }) => {
  const excludedBuiltinsDict = toDictionary(excludedBuiltins, "word");
  const adjectiveCards = getFilteredWordList(
    adjectives,
    excludedBuiltinsDict,
    "adjective"
  );
  const nounCards = getFilteredWordList(nouns, excludedBuiltinsDict, "noun");
  const allCards = [...adjectiveCards, ...nounCards];
  return (
    <Stack borderColor="gray.200" boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px;">
      {allCards.map((card, index) => (
        <WordCard key={index} {...card} />
      ))}
    </Stack>
  );
};
