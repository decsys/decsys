import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { WordCardList } from "./components/WordCardList";
import LightHeading from "components/core/LightHeading";
import adjectives from "services/adjectives";
import animals from "services/animals";
import { fetchWordList } from "api/wordlist";
import { Page } from "components/core";
import { toDictionary } from "services/data-structures";
import { getFilteredWordList } from "./components/helpers";

const Wordlist = () => {
  const [wordList, setWordList] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const getWordList = async () => {
      const data = await fetchWordList();
      setWordList(data);
    };

    getWordList();
  }, []);

  useEffect(() => {
    if (wordList) {
      const excludedBuiltinsDict = toDictionary(
        wordList.excludedBuiltins,
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
  }, [wordList]);

  return (
    <Page layout="default">
      <Box p={2}>
        <LightHeading as="h1" size="xl" py={2}>
          My Wordlist
        </LightHeading>

        {cards.length > 0 && <WordCardList cards={cards} />}
      </Box>
    </Page>
  );
};

export default Wordlist;
