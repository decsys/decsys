import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Flex,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Tooltip,
  HStack,
  RangeSliderMark,
} from "@chakra-ui/react";
import { excludeBuiltinWords, includeBuiltinWords } from "api/wordlist";
import LightHeading from "components/core/LightHeading";
import adjectives from "services/adjectives";
import animals from "services/animals";
import { fetchWordList } from "api/wordlist";
import { Page } from "components/core";
import { toDictionary } from "services/data-structures";
import { getFilteredWordList } from "./components/helpers";
import { useWordlistSortingAndFiltering } from "./components/useWordlistSortingAndFiltering";
import { WordCard } from "./components/WordCard";
import WordlistSortingAndFilteringPanel from "./WordlistSortingAndFiltering";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { FormControl, FormLabel } from "@chakra-ui/react";

const Wordlist = () => {
  const [wordlist, setWordlist] = useState(null);
  const [cards, setCards] = useState([]);
  const { sorting, onSort, outputList, filter, setFilter } =
    useWordlistSortingAndFiltering(cards);
  const [sliderValues, setSliderValues] = useState([1, 15]);

  const handleSliderChange = (values) => {
    setSliderValues(values);
  };

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

          <HStack spacing={5} align="center">
            <FormLabel mb="0" mr={2} htmlFor="word-length">
              Word Length:
            </FormLabel>
            <Flex width="300px">
              <RangeSlider
                id="word-length"
                defaultValue={[1, 15]}
                min={1}
                max={15}
                step={1}
                onChange={handleSliderChange}
                value={sliderValues}
              >
                <RangeSliderMark
                  value={sliderValues[0]}
                  textAlign="center"
                  mt="-30px"
                  ml="-6px"
                >
                  {sliderValues[0]}
                </RangeSliderMark>
                <RangeSliderMark
                  value={sliderValues[1]}
                  textAlign="center"
                  mt="-30px"
                  ml="-6px"
                >
                  {sliderValues[1]}
                </RangeSliderMark>
                <RangeSliderTrack bg="blue.100">
                  <RangeSliderFilledTrack bg="blue.500" />
                </RangeSliderTrack>
                <RangeSliderThumb boxSize={4} index={0} />
                <RangeSliderThumb boxSize={4} index={1} />
              </RangeSlider>
            </Flex>
          </HStack>
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
