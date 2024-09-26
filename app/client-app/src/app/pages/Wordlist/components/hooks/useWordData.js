import { useEffect, useState } from "react";
import {
  getWordlistById,
  excludeBuiltinWords,
  includeBuiltinWords,
} from "api/wordlist";
import adjectives from "services/adjectives";
import animals from "services/animals";
import { toDictionary } from "services/data-structures";
import { getFilteredWordList } from "../helpers/getFilteredWordList";

export const useWordData = (id) => {
  const [cards, setCards] = useState([]);

  const { data: wordlist } = getWordlistById(id);

  const processCards = () => {
    if (wordlist) {
      const excludedBuiltinsDict = toDictionary(
        wordlist.excludedBuiltins,
        "word"
      );

      // Processing built-in words
      const adjectiveCards = getFilteredWordList(
        adjectives,
        excludedBuiltinsDict,
        "adjective",
        false
      );
      const nounCards = getFilteredWordList(
        animals,
        excludedBuiltinsDict,
        "noun",
        false
      );

      // Processing custom words
      const customAdjectives = wordlist.customWords
        .filter((word) => word.type === "adjective")
        .map((word) => word.word);
      const customNouns = wordlist.customWords
        .filter((word) => word.type === "noun")
        .map((word) => word.word);

      const customAdjectiveCards = getFilteredWordList(
        customAdjectives,
        excludedBuiltinsDict,
        "adjective",
        true
      );
      const customNounCards = getFilteredWordList(
        customNouns,
        excludedBuiltinsDict,
        "noun",
        true
      );

      // Combine all cards
      setCards([
        ...adjectiveCards,
        ...nounCards,
        ...customAdjectiveCards,
        ...customNounCards,
      ]);
    }
  };

  useEffect(() => {
    processCards();
  }, [wordlist]);

  const toggleExclude = async (word, type, isExcludedBuiltin) => {
    const id = wordlist.id;

    if (isExcludedBuiltin) {
      await includeBuiltinWords(id, type, word);
    } else {
      await excludeBuiltinWords(id, type, word);
    }

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.word === word
          ? { ...card, isExcludedBuiltin: !isExcludedBuiltin }
          : card
      )
    );
  };

  return { wordlist, cards, setCards, toggleExclude };
};
