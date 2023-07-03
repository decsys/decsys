import { useEffect, useState } from "react";
import { Box, Stack, Flex } from "@chakra-ui/react";
import { excludeBuiltinWords, includeBuiltinWords } from "api/wordlist";
import LightHeading from "components/core/LightHeading";
import adjectives from "services/adjectives";
import animals from "services/animals";
import { fetchWordList } from "api/wordlist";
import { Page } from "components/core";
import { toDictionary } from "services/data-structures";
import { getFilteredWordList } from "./components/helpers";
import { useWordlistSortingAndFiltering } from "./components/useWordlistSortingAndFiltering";
import { FixedSizeList as List } from "react-window";
import { WordCard } from "./components/WordCard";
import WordlistSortingAndFilteringPanel from "./WordlistSortingAndFiltering";

const Wordlist = () => {
  const [wordlist, setWordlist] = useState(null);
  const [cards, setCards] = useState([]);
  const { sorting, onSort, outputList, filter, setFilter } =
    useWordlistSortingAndFiltering(cards);

  useEffect(() => {
    const getWordList = async () => {
      const data = await fetchWordList();
      setWordlist(data);
    };

    getWordList();
  }, []);

  useEffect(() => {
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

  const RenderWordCard = ({ index, style }) => {
    const card = outputList[index];
    return card ? (
      <div style={style}>
        <WordCard
          word={card.word}
          type={card.type}
          isExcludedBuiltin={card.isExcludedBuiltin}
          onToggleExclude={() =>
            toggleExclude(card.word, card.type, card.isExcludedBuiltin)
          }
        />
      </div>
    ) : null;
  };

  return (
    <Page layout="default">
      <Box p={2}>
        <LightHeading as="h1" size="xl" py={2}>
          My Wordlist
        </LightHeading>
        <Stack mt={2} spacing={4} h="80vh">
          <WordlistSortingAndFilteringPanel
            data={cards}
            sorting={sorting}
            onSort={onSort}
            filter={filter}
            setFilter={setFilter}
          />
          {cards.length > 0 && (
            <List
              height={1000}
              width={1000}
              itemCount={cards.length}
              itemSize={80}
            >
              {RenderWordCard}
            </List>
          )}
        </Stack>
      </Box>
    </Page>
  );
};
export default Wordlist;
