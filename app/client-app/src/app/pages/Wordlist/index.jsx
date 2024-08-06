import { useState } from "react";
import {
  Stack,
  Flex,
  useRadioGroup,
  VStack,
  Spacer,
  Grid,
  useColorMode,
  Text,
  LightMode,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
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
import { useQueryString } from "hooks/useQueryString";
import { defaultColorMode } from "themes";
import NameInput from "components/shared/NameInput";
import { FaChevronLeft, FaTrash } from "react-icons/fa";
import { Link, useLocation } from "@reach/router";
import { DeleteButton } from "../Wordlists/component/DeleteWordlistModal";
import { navigate } from "@reach/router";

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

const handleRemoveWordList = () => {
  navigate("/admin/wordlists");
};

const Wordlist = ({ id }) => {
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

  const { colorMode } = useColorMode();
  const bg = { light: "gray.800" };

  return (
    <>
      <Grid
        width="100%"
        gap={0}
        templateColumns="auto 1fr auto auto auto auto auto"
        bg={bg[colorMode || defaultColorMode]}
      >
        <BackButton />
        {/* TODO: FIX NAME EDIT */}
        <Flex bg="gray.100">Name</Flex>
        <DeleteButton wordlistId={id} onRemoveWordList={handleRemoveWordList} />
      </Grid>
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
    </>
  );
};

export default Wordlist;
