import { Box } from "@chakra-ui/react";
import { WordCardList } from "./components/WordCardList";
import LightHeading from "components/core/LightHeading";

//placeholder
const Wordlist = () => {
  const adjectives = ["happy", "sad", "angry"];
  const nouns = ["cat", "dog", "bird"];
  const excludedWords = ["sad", "cat", "bird"];

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
