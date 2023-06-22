import { Box } from "@chakra-ui/react";
import { WordCardList } from "./components/WordCardList";
import LightHeading from "components/core/LightHeading";
import adjectives from "services/adjectives";
import animals from "services/animals";
import { fetchWordList } from "api/wordlist";
import { useEffect, useState } from "react";

const Wordlist = () => {
  const [wordList, setWordList] = useState(null);

  useEffect(() => {
    const getWordList = async () => {
      const data = await fetchWordList();
      setWordList(data);
    };

    getWordList();
  }, []);

  return (
    <Box p={2}>
      <LightHeading as="h1" size="xl" py={2}>
        My Wordlist
      </LightHeading>

      {wordList && (
        <WordCardList
          adjectives={adjectives}
          nouns={animals}
          excludedBuiltins={wordList.excludedBuiltins}
        />
      )}
    </Box>
  );
};

export default Wordlist;
