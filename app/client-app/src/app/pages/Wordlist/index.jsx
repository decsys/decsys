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
    <Page layout={null}>
      <Box p={2}>
        <LightHeading as="h1" size="xl" py={2}>
          My Wordlist
        </LightHeading>
        <Flex direction="column" mt={2} h="80vh" overflow="hidden">
          <WordlistSortingAndFilteringPanel
            data={cards}
            sorting={sorting}
            onSort={onSort}
            filter={filter}
            setFilter={setFilter}
          />
          {cards.length > 0 && (
            <Box flex="1 1 auto" overflow="hidden" py={2}>
              <div style={{ width: "100%", height: "100%" }}>
                <AutoSizer>
                  {({ height, width }) => (
                    <List
                      height={height}
                      width={width}
                      itemCount={cards.length}
                      itemSize={80}
                    >
                      {RenderWordCard}
                    </List>
                  )}
                </AutoSizer>
              </div>
            </Box>
          )}
        </Flex>
      </Box>
    </Page>
  );
};
export default Wordlist;
