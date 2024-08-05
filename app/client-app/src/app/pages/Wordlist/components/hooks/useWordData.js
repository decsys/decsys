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
  const [wordlist, setWordlist] = useState(null);
  const [cards, setCards] = useState([]);

  const fetchWordData = async () => {
    const data = await getWordlistById(id);
    setWordlist(data);
  };

  const processCards = () => {
    if (wordlist) {
      const excludedBuiltinsDict = toDictionary(
        wordlist.excludedBuiltins,
        "word"
      );
      const adjectiveCards = getFilteredWordList(
        adjectives,
        excludedBuiltinsDict,
        "adjective"
      );
      const nounCards = getFilteredWordList(
        animals,
        excludedBuiltinsDict,
        "noun"
      );
      setCards([...adjectiveCards, ...nounCards]);
    }
  };

  useEffect(() => {
    fetchWordData();
  }, []);

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
