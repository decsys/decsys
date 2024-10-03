import { useEffect, useState } from "react";
import { Stack, Flex, useRadioGroup, VStack, Spacer } from "@chakra-ui/react";
import WordlistSortingAndFilteringPanel from "../components/WordlistSortingAndFiltering";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { TypeFilter, WordLengthFilter } from "../components/WordCardFilters";
import { useWordlistSortingAndFiltering } from "../components/hooks/useWordlistSortingAndFiltering";
import { Page } from "components/core";
import { WordCard } from "../components/WordCard";
import adjectives from "services/adjectives";
import animals from "services/animals";
import EditorBar from "./editorBar";

const isDefaultWordlist = true;

const WordlistDisplay = ({ outputList, height, width }) => {
  const RenderWordCard = ({ index, style }) => {
    const card = outputList[index];
    return card ? (
      <div style={style}>
        <WordCard
          word={card.word}
          type={card.type}
          isDefaultWordlist={isDefaultWordlist}
        />
      </div>
    ) : null;
  };

  return (
    <FixedSizeList
      height={height}
      width={width}
      itemCount={outputList.length}
      itemSize={80}
    >
      {RenderWordCard}
    </FixedSizeList>
  );
};

const DefaultWordlist = () => {
  const [combinedList, setCombinedList] = useState([]);

  useEffect(() => {
    function mergeLists(animals, adjectives) {
      const animalObjects = animals.map((animal) => ({
        type: "noun",
        word: animal,
      }));

      const adjectiveObjects = adjectives.map((adjective) => ({
        type: "adjective",
        word: adjective,
      }));

      return [...animalObjects, ...adjectiveObjects];
    }

    const initialCombinedList = mergeLists(animals, adjectives);
    setCombinedList(initialCombinedList);
  }, []);

  const { sorting, onSort, outputList, filterConfig, setFilter } =
    useWordlistSortingAndFiltering(combinedList);
  const [sliderValues, setSliderValues] = useState([1, 15]);

  const handleSliderChange = (values) => {
    setSliderValues(values);
    setFilter("wordLengthMatches", values);
  };

  const { getRootProps: getTypeRootProps, getRadioProps: getTypeRadioProps } =
    useRadioGroup({
      name: "type",
      defaultValue: "All",
      onChange: (value) => setFilter("typeMatches", value),
    });

  const typeGroup = getTypeRootProps();

  return (
    <Page layout={null}>
      <Flex boxShadow="section-h" gridColumn="span 2" zIndex={3}>
        <EditorBar />
      </Flex>
      <Flex direction="column" height={`calc(100vh - 54px)`} width="100%">
        <Stack mt={2} spacing={4} h="100vh" p={2}>
          <Flex p={2} boxShadow="base" backgroundColor="gray.50">
            <VStack alignItems="start">
              <TypeFilter
                group={typeGroup}
                getRadioProps={getTypeRadioProps}
                isDefaultWordlist={isDefaultWordlist}
              />

              <WordLengthFilter
                sliderValues={sliderValues}
                handleSliderChange={handleSliderChange}
              />
            </VStack>
            <Spacer />
            <WordlistSortingAndFilteringPanel
              data={combinedList}
              sorting={sorting}
              onSort={onSort}
              filterConfig={filterConfig}
              setFilter={setFilter}
              isDefaultWordlist={isDefaultWordlist}
            />
          </Flex>
          <Flex flex="1">
            <AutoSizer>
              {({ height, width }) => (
                <WordlistDisplay
                  outputList={outputList}
                  height={height}
                  width={width}
                />
              )}
            </AutoSizer>
          </Flex>
        </Stack>
      </Flex>
    </Page>
  );
};

export default DefaultWordlist;
