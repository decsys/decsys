import { useEffect, useState } from "react";
import {
  Stack,
  Flex,
  useRadioGroup,
  VStack,
  Spacer,
  useColorMode,
  Button,
} from "@chakra-ui/react";
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
import { defaultColorMode } from "themes";
import { FaChevronLeft } from "react-icons/fa";
import { Link } from "@reach/router";
import { FetchWordlistProvider } from "./components/context/FetchWordlist";
import { EditorBarContextProvider } from "./components/context/EditorBar";
import { Page } from "components/core";
import { listWordlist } from "api/wordlist";
import { css, Global } from "@emotion/react";
import EditorBar from "./components/EditorBar";

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

export const BarButton = (p) => {
  const { colorMode } = useColorMode();
  const scheme =
    p.colorScheme || (colorMode || defaultColorMode) === "light"
      ? "dark-gray"
      : "gray";
  return (
    <Button
      colorScheme={scheme}
      lineHeight="inherit"
      height="100%"
      py={2}
      borderRadius={0}
      {...p}
    />
  );
};

export const BackButton = () => (
  <BarButton as={Link} to="/admin/wordlists" leftIcon={<FaChevronLeft />}>
    Wrordlists
  </BarButton>
);

const Wordlist = ({ id, navigate }) => {
  const { cards, toggleExclude } = useWordData(id);
  const { sorting, onSort, outputList, filterConfig, setFilter } =
    useWordlistSortingAndFiltering(cards);
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

  const {
    getRootProps: getExclusionRootProps,
    getRadioProps: getExclusionRadioProps,
  } = useRadioGroup({
    name: "exclusion",
    defaultValue: "All",
    onChange: (value) => setFilter("exclusionStateMatches", value),
  });
  const typeGroup = getTypeRootProps();
  const exclusionGroup = getExclusionRootProps();

  return (
    <Page layout={null}>
      <Global
        // Something (?) on the Editor page overflows the 100vh grid incorrectly
        // so this just hides it; anywhere we expect to overflow is correctly set anyway.
        styles={css`
          body {
            overflow: hidden;
          }
        `}
      />
      <FetchWordlistProvider id={id}>
        <EditorBarContextProvider navigate={navigate}>
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
                  />
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
        </EditorBarContextProvider>
      </FetchWordlistProvider>
    </Page>
  );
};

export default Wordlist;
