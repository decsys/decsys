import { Box } from "@chakra-ui/react";
import { WordCardList } from "./components/WordCardList";
import LightHeading from "components/core/LightHeading";
import adjectives from "services/adjectives";
import animals from "services/animals";
import { fetchWordList } from "api/wordlist";
import { useEffect, useState } from "react";

const Wordlist = () => {
  const [wordList, setWordList] = useState([]);

  useEffect(() => {
    const getWordList = async () => {
      const data = await fetchWordList();
      setWordList(data);
    };

    getWordList();
  }, []);

  console.log(wordList);
  //Sample Data
  const excludedWords = [
    {
      type: "adjective",
      word: "aback",
    },
    {
      type: "adjective",
      word: "abaft",
    },
  ];

  return (
    <Box p={2}>
      <LightHeading as="h1" size="xl" py={2}>
        My Wordlist
      </LightHeading>

      <WordCardList
        adjectives={adjectives}
        nouns={animals}
        excludedWords={excludedWords}
      />
    </Box>
  );
};

export default Wordlist;
