import { useState } from "react";
import { Stack, Flex, useRadioGroup, VStack, Spacer } from "@chakra-ui/react";
import LightHeading from "components/core/LightHeading";
import { Page } from "components/core";
import { useWordlistSortingAndFiltering } from "./components/useWordlistSortingAndFiltering";
import { WordCard } from "./components/WordCard";
import WordlistSortingAndFilteringPanel from "./WordlistSortingAndFiltering";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  ExclusionFilter,
  TypeFilter,
  WordLengthFilter,
} from "./components/WordCardFilters";
import { useWordData } from "./components/useWordData";

const WordlistDisplay = ({ outputList, height, width, toggleExclude }) => {
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

const Wordlist = () => {
  const { cards, toggleExclude } = useWordData();
  const { sorting, onSort, outputList, filter, setFilter } =
    useWordlistSortingAndFiltering(cards);
  const [sliderValues, setSliderValues] = useState([1, 15]);

  const handleSliderChange = (values) => {
    setSliderValues(values);
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "framework",
    defaultValue: "react",
    onChange: console.log,
  });

  const group = getRootProps();

  return (
    <Page layout="wordlist">
      <Flex direction="column" height={`calc(100vh - 54px)`} width="100%">
        <LightHeading p="2" as="h2" size="lg">
          My Wordlist
        </LightHeading>
        <Stack mt={2} spacing={4} h="100vh" p={2}>
          <Flex p={2} boxShadow="base">
            <VStack alignItems="start">
              <TypeFilter group={group} getRadioProps={getRadioProps} />
              <ExclusionFilter group={group} getRadioProps={getRadioProps} />
              <WordLengthFilter
                sliderValues={sliderValues}
                handleSliderChange={handleSliderChange}
              />
            </VStack>
            <Spacer />
            <WordlistSortingAndFilteringPanel
              data={cards}
              sorting={sorting}
              onSort={onSort}
              filter={filter}
              setFilter={setFilter}
            />
          </Flex>
          <Flex flex="1">
            <AutoSizer>
              {({ height, width }) => (
                <WordlistDisplay
                  outputList={outputList}
                  height={height}
                  width={width}
                  toggleExclude={toggleExclude}
                />
              )}
            </AutoSizer>
          </Flex>
        </Stack>
      </Flex>
    </Page>
  );
};

export default Wordlist;
