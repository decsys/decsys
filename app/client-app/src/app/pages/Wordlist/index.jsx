import { Box } from "@chakra-ui/react";
import { WordCardList } from "./components/WordCardList";
import LightHeading from "components/core/LightHeading";

const Wordlist = () => {
  const adjectives = ["happy", "sad", "excited"];
  const nouns = ["apple", "car", "house"];
  const excludedWords = [
    {
      type: "adjective",
      word: "happy",
    },
    {
      type: "noun",
      word: "apple",
    },
  ];
  return (
    <Box p={2}>
      <LightHeading as="h1" size="xl" py={2}>
        My Wordlist
      </LightHeading>

      <WordCardList
        adjectives={adjectives}
        nouns={nouns}
        excludedWords={excludedWords}
      />
    </Box>
  );
};

export default Wordlist;
