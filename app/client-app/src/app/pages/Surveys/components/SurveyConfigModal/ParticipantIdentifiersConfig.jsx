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
  Select,
} from "@chakra-ui/react";
import generateGfyCatStyleUrl from "services/gfycat-style-urls.js";
import produce from "immer";
import { getWordlistById } from "api/wordlist";
import { listWordlist } from "api/wordlist";

const ParticipantIdentifiersConfig = ({ data, mutate }) => {
  const [idGenCount, setIdGenCount] = useState(10);
  const [wordLists, setWordLists] = useState(null);
  const [selectedWordlistId, setSelectedWordlistId] = useState("");

  const handleGenCountChange = ({ target: { value } }) =>
    setIdGenCount(parseInt(value));

  const { data: wordList } = getWordlistById(selectedWordlistId);

  const getWordlists = async () => {
    const data = await listWordlist();
    setWordLists(data);
  };

  useEffect(() => {
    getWordlists(wordLists);
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

      <Text fontWeight="semibold" mt={1}>
        Generate Random Identifiers
      </Text>
      {wordLists && (
        <Select
          placeholder="Select Wordlists"
          onChange={({ target: { value } }) => setSelectedWordlistId(value)}
        >
          {wordLists.map((wordlist) => (
            <option key={wordlist.id} value={wordlist.id}>
              {wordlist.name}
            </option>
          ))}
        </Select>
      )}

      {selectedWordlistId && (
        <VStack align="stretch">
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
          <Textarea
            height="inherit"
            rows="6"
            value={data.validIdentifiers.join("\n")}
            onChange={({ target: { value } }) =>
              mutate({ ...data, validIdentifiers: value.split("\n") }, false)
            }
          />
        </VStack>
      )}
    </>
  );
};

export default ParticipantIdentifiersConfig;
