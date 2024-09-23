import { useEffect, useState } from "react";
import {
  Stack,
  Flex,
  useRadioGroup,
  VStack,
  Spacer,
  Button,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Select,
  Input,
  useToast,
  Text,
  RadioGroup,
  Radio,
  FormLabel,
  Divider,
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
import { Field, Formik } from "formik";
import { addCustomWord } from "api/wordlist";
import adjectives from "services/adjectives";
import animals from "services/animals";
import { object, string } from "yup";

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

const Wordlist = ({ id, navigate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { cards, toggleExclude } = useWordData(id);
  const { sorting, onSort, outputList, filterConfig, setFilter } =
    useWordlistSortingAndFiltering(cards);
  const [sliderValues, setSliderValues] = useState([1, 15]);
  const [value, setValue] = useState("1");

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

  const wordExists = (word) => {
    const result = adjectives.includes(word) || animals.includes(word);
    return result;
  };

  const customWordSchema = object({
    type: string().required("You must select a type"),
    customWord: string().required("Custom word is required"),
  });
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
                    validationSchema={customWordSchema}
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
                        toast({
                          title: "Success",
                          description: `Word "${values.customWord}" added successfully!`,
                          status: "success",
                          duration: 3000,
                          isClosable: true,
                        });
                      } catch (error) {
                        console.error("Failed to add word:", error);
                        toast({
                          title: "Error",
                          description: "Failed to add the word.",
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
                        <Modal isOpen={isOpen} onClose={onClose}>
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>Add a Custom Word</ModalHeader>
                            <Divider />
                            <ModalCloseButton />
                            <ModalBody>
                              <form onSubmit={handleSubmit} id="myForm">
                                <VStack align="start">
                                  <FormLabel mb="0">Word</FormLabel>
                                  <Input
                                    name="customWord"
                                    placeholder="New Custom Word"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.customWord}
                                    isInvalid={
                                      touched.customWord &&
                                      Boolean(errors.customWord)
                                    }
                                  />
                                  {touched.customWord && errors.customWord && (
                                    <Text color="red">{errors.customWord}</Text>
                                  )}
                                  <FormLabel pt="2">Type</FormLabel>
                                  <Field name="type">
                                    {({ field }) => (
                                      <>
                                        <RadioGroup
                                          {...field}
                                          onChange={(value) =>
                                            setFieldValue("type", value)
                                          }
                                        >
                                          <Stack direction="row">
                                            <Radio value="noun">Noun</Radio>
                                            <Radio value="adjective">
                                              Adjective
                                            </Radio>
                                          </Stack>
                                        </RadioGroup>
                                        {touched.type && errors.type && (
                                          <Text color="red">{errors.type}</Text>
                                        )}
                                      </>
                                    )}
                                  </Field>
                                </VStack>
                              </form>
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                colorScheme="red"
                                mr={3}
                                onClick={onClose}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                form="myForm"
                                isLoading={isSubmitting}
                                colorScheme="blue"
                              >
                                Save
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
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
