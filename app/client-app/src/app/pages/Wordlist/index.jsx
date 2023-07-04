import { useEffect, useState } from "react";
import { Box, Stack, Flex, Heading } from "@chakra-ui/react";
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
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

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
    <Page layout="wordlist">
      <Flex direction="column" height={`calc(100vh - 54px)`} width="100%">
        <LightHeading p={2} as="h2" size="lg">
          My Wordlist
        </LightHeading>
        <Stack mt={2} spacing={4} h="100vh" p={2}>
          <WordlistSortingAndFilteringPanel
            data={cards}
            sorting={sorting}
            onSort={onSort}
            filter={filter}
            setFilter={setFilter}
          />
          <Box flex="1" overflow="auto">
            <AutoSizer>
              {({ height, width }) => (
                <FixedSizeList
                  height={height}
                  width={width}
                  itemCount={outputList.length}
                  itemSize={80}
                >
                  {RenderWordCard}
                </FixedSizeList>
              )}
            </AutoSizer>
          </Box>
        </Stack>
      </Flex>
    </Page>
  );
};
export default Wordlist;
