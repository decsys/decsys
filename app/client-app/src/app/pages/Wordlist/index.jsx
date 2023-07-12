import { useState } from "react";
import { Stack, Flex, useRadioGroup, VStack, Spacer } from "@chakra-ui/react";
import { Page } from "components/core";
import { WordCard } from "./components/WordCard";
import WordlistSortingAndFilteringPanel from "./components/WordlistSortingAndFiltering";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  ExclusionFilter,
  TypeFilter,
  WordLengthFilter,
} from "./components/WordCardFilters";
import { useWordlistSortingAndFiltering } from "./components/hooks/useWordlistSortingAndFiltering";
import { useWordData } from "./components/hooks/useWordData";

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
  const { sorting, onSort, outputList, filterConfig, setFilter } =
    useWordlistSortingAndFiltering(cards);
  const [sliderValues, setSliderValues] = useState([1, 15]);

  const handleSliderChange = (values) => {
    setSliderValues(values);
  };

  const handleTypeChange = (value) => {
    setFilter("typeMatches", value);
  };

  const { getRootProps: getTypeRootProps, getRadioProps: getTypeRadioProps } =
    useRadioGroup({
      name: "type",
      defaultValue: "All",
      onChange: handleTypeChange,
    });

  const {
    getRootProps: getExclusionRootProps,
    getRadioProps: getExclusionRadioProps,
  } = useRadioGroup({
    name: "exclusion",
    defaultValue: "All",
    onChange: console.log,
  });
  const typeGroup = getTypeRootProps();
  const exclusionGroup = getExclusionRootProps();

  return (
    <Page layout="wordlist">
      <Flex direction="column" height={`calc(100vh - 54px)`} width="100%">
        <Stack mt={2} spacing={4} h="100vh" p={2}>
          <Flex p={2} boxShadow="base" backgroundColor="gray.50">
            <VStack alignItems="start">
              <TypeFilter group={typeGroup} getRadioProps={getTypeRadioProps} />
              <ExclusionFilter
                group={exclusionGroup}
                getRadioProps={getExclusionRadioProps}
              />
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
              filterConfig={filterConfig}
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
