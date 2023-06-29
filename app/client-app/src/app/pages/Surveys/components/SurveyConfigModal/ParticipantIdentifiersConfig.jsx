import { useEffect, useState } from "react";
import { FaInfoCircle, FaClipboardList } from "react-icons/fa";
import {
  Flex,
  Text,
  Button,
  Input,
  Textarea,
  Stack,
  Icon,
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  Box,
  AccordionButton,
  VStack,
} from "@chakra-ui/react";
import generateGfyCatStyleUrl from "services/gfycat-style-urls.js";
import produce from "immer";
import { fetchWordList } from "api/wordlist";

const ParticipantIdentifiersConfig = ({ data, mutate }) => {
  const [idGenCount, setIdGenCount] = useState(10);
  const [wordList, setWordList] = useState(null);

  const handleGenCountChange = ({ target: { value } }) =>
    setIdGenCount(parseInt(value));

  const getWordList = async () => {
    const data = await fetchWordList();
    setWordList(data);
  };

  useEffect(() => {
    getWordList(wordList);
  }, []);

  const handleIdGenClick = () =>
    mutate(
      produce((config) => {
        config.validIdentifiers.push(
          ...Array(idGenCount)
            .fill(() =>
              generateGfyCatStyleUrl(wordList.excludedBuiltins, 1, "", true)
            )
            .map((x) => x())
        );
      }),
      false
    );

  return (
    <>
      <Text fontWeight="bold" mt={1}>
        Valid Participant Identifiers
      </Text>

      <Flex alignItems="center" my={1} ml={2}>
        <Icon as={FaInfoCircle} fontSize="5em" color="cyan.500" />
        <Flex flexDirection="column" ml={2}>
          <Text color="cyan.500">
            • Restrict Survey access to only these Identifiers
          </Text>
          <Text color="cyan.500">• One Identifier per line</Text>
          <Text color="cyan.500">
            • Leave empty to require participants to enter a unique identifier
          </Text>
        </Flex>
      </Flex>

      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              Generate Random Identifiers
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <VStack align="stretch">
              <Button
                size="md"
                colorScheme="blue"
                as="a"
                href="/admin/wordlist/"
                leftIcon={<FaClipboardList />}
              >
                Manage Wordlist
              </Button>
              <Stack direction="row">
                <Flex>
                  <Input
                    size="sm"
                    type="number"
                    value={idGenCount}
                    onChange={handleGenCountChange}
                  />
                </Flex>
                <Button size="sm" colorScheme="gray" onClick={handleIdGenClick}>
                  Generate Random IDs
                </Button>
              </Stack>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Textarea
        height="inherit"
        rows="6"
        value={data.validIdentifiers.join("\n")}
        onChange={({ target: { value } }) =>
          mutate({ ...data, validIdentifiers: value.split("\n") }, false)
        }
      />
    </>
  );
};

export default ParticipantIdentifiersConfig;
