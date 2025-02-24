import { useEffect, useState } from "react";
import {
  Stack,
  Flex,
  useRadioGroup,
  VStack,
  Spacer,
  Button,
  useDisclosure,
  useToast,
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
import { FetchWordlistProvider } from "./components/context/FetchWordlist";
import { EditorBarContextProvider } from "./components/context/EditorBar";
import { Page } from "components/core";
import EditorBar from "./components/EditorBar";
import { FaPlusCircle } from "react-icons/fa";
import { Formik } from "formik";
import { addCustomWord } from "api/wordlist";
import { AddCustomWordModel } from "./components/AddCustomWordModel";
import { wordExists } from "./components/helpers/doesWordExist";
import { validationSchema } from "./validation";

const WordlistDisplay = ({
  outputList,
  height,
  width,
  toggleExclude,
  wordlistId,
}) => {
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
          isCustomWord={card.isCustomWord}
          wordlistId={wordlistId}
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

const Wordlist = ({ id, navigate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { cards, toggleExclude, mutate } = useWordData(id);
  const { sorting, onSort, outputList, filterConfig, setFilter } =
    useWordlistSortingAndFiltering(cards);

  const [maxLength, setMaxLength] = useState(15);

  useEffect(() => {
    let maxSliderValue = 15;
    cards.forEach((wordCard) => {
      if (wordCard.word.length > maxSliderValue) {
        maxSliderValue = wordCard.word.length;
      }
    });
    setMaxLength(maxSliderValue);
  }, [cards]);

  const [sliderValues, setSliderValues] = useState([1, maxLength]);

  useEffect(() => {
    setSliderValues([sliderValues[0], maxLength]);
  }, [maxLength]);

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

  const toast = useToast();

  return (
    <Page layout={null}>
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
                    maxLength={maxLength}
                  />
                </VStack>
                <Spacer />
                <VStack alignItems="end" spacing="4">
                  <Button
                    onClick={onOpen}
                    leftIcon={<FaPlusCircle />}
                    colorScheme="green"
                    mt="4"
                  >
                    Add a Custom Word
                  </Button>
                  <Formik
                    initialValues={{ type: "", customWord: "" }}
                    validationSchema={validationSchema}
                    onSubmit={async (
                      values,
                      { setSubmitting, setFieldError }
                    ) => {
                      if (wordExists(values.customWord)) {
                        setFieldError(
                          "customWord",
                          "This word already exists in the wordlist!"
                        );
                        setSubmitting(false);
                        return;
                      }
                      try {
                        await addCustomWord(id, values.type, values.customWord);
                        mutate();
                        toast({
                          title: "Success",
                          description: `Word "${values.customWord}" added successfully!`,
                          status: "success",
                          duration: 3000,
                          isClosable: true,
                        });
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: `Failed to add the word "${values.customWord}".`,
                          status: "error",
                          duration: 3000,
                          isClosable: true,
                        });
                      }
                      setSubmitting(false);
                      onClose();
                    }}
                  >
                    {({
                      handleSubmit,
                      isSubmitting,
                      handleChange,
                      values,
                      errors,
                      touched,
                      handleBlur,
                      resetForm,
                      setFieldValue,
                    }) => {
                      useEffect(() => {
                        if (!isOpen) {
                          resetForm();
                        }
                      }, [isOpen, resetForm]);

                      return (
                        <AddCustomWordModel
                          isOpen={isOpen}
                          onClose={onClose}
                          values={values}
                          handleSubmit={handleSubmit}
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                          errors={errors}
                          touched={touched}
                          isSubmitting={isSubmitting}
                          setFieldValue={setFieldValue}
                        />
                      );
                    }}
                  </Formik>

                  <WordlistSortingAndFilteringPanel
                    data={cards}
                    sorting={sorting}
                    onSort={onSort}
                    filterConfig={filterConfig}
                    setFilter={setFilter}
                  />
                </VStack>
              </Flex>

              <Flex flex="1">
                <AutoSizer>
                  {({ height, width }) => (
                    <WordlistDisplay
                      outputList={outputList}
                      height={height}
                      width={width}
                      toggleExclude={toggleExclude}
                      wordlistId={id}
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
