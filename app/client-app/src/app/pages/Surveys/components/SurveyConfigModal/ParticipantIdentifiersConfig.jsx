import { useEffect, useState } from "react";
import { FaClipboardList, FaInfoCircle, FaListUl } from "react-icons/fa";
import {
  Flex,
  Text,
  Button,
  Input,
  Textarea,
  Stack,
  Icon,
  VStack,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  HStack,
} from "@chakra-ui/react";
import generateGfyCatStyleUrl from "services/gfycat-style-urls.js";
import produce from "immer";
import { getWordlistById, listWordlist } from "api/wordlist";

const ParticipantIdentifiersConfig = ({ data, mutate }) => {
  const [idGenCount, setIdGenCount] = useState(10);
  const [wordLists, setWordLists] = useState(null);
  const [selectedWordlistId, setSelectedWordlistId] = useState("");

  useEffect(() => {
    async function fetchWordlists() {
      const data = await listWordlist();
      setWordLists([{ id: "default", name: "Default Wordlist" }, ...data]);
    }
    fetchWordlists();
  }, []);

  const handleGenCountChange = ({ target: { value } }) =>
    setIdGenCount(parseInt(value));

  const wordList =
    selectedWordlistId && selectedWordlistId !== "default"
      ? wordLists.find((wl) => wl.id === selectedWordlistId)
      : null;

  const customAdjectives = wordList?.customWords
    ?.filter((word) => word.type === "adjective")
    .map((word) => word.word);
  const customNouns = wordList?.customWords
    ?.filter((word) => word.type === "noun")
    .map((word) => word.word);

  const handleIdGenClick = () => {
    const isDefault = selectedWordlistId === "default";

    const params = isDefault
      ? [[], 1, "", true] // Parameters for default case
      : [wordList.excludedBuiltins, 1, "", true, customAdjectives, customNouns]; // Parameters for non-default case

    mutate(
      produce((config) => {
        config.validIdentifiers.push(
          ...Array(idGenCount)
            .fill(() => generateGfyCatStyleUrl(...params))
            .map((x) => x())
        );
      }),
      false
    );
  };

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
      <Alert status="info">
        <VStack>
          <HStack>
            <AlertIcon />
            <AlertTitle fontSize="md">Selecting a Wordlist</AlertTitle>
          </HStack>
          <AlertDescription fontSize="sm">
            You can create new wordlists from the "Manage Wordlists" section.
            The default wordlist is not editable, but any new ones you create
            can be modified as needed.
          </AlertDescription>
        </VStack>
      </Alert>
      <Flex justifyContent="center">
        <VStack w="95%" spacing={2}>
          <Button
            size="md"
            colorScheme="green"
            as="a"
            href="/admin/wordlists/"
            w="100%"
            leftIcon={<FaListUl />}
          >
            Manage Wordlists
          </Button>

          {wordLists && (
            <Select
              placeholder="Select wordlist to generate identifiers"
              onChange={({ target: { value } }) => setSelectedWordlistId(value)}
              w="100%"
            >
              {wordLists.map((wordlist) => (
                <option key={wordlist.id} value={wordlist.id}>
                  {wordlist.name}
                </option>
              ))}
            </Select>
          )}

          {(selectedWordlistId || data.validIdentifiers.length > 0) && (
            <VStack align="stretch" w="100%">
              {selectedWordlistId && (
                <Stack direction="row" spacing={2}>
                  <Input
                    size="sm"
                    type="number"
                    width="100px"
                    value={idGenCount}
                    onChange={handleGenCountChange}
                  />
                  <Button
                    size="sm"
                    colorScheme="gray"
                    onClick={handleIdGenClick}
                    flexGrow={1}
                  >
                    <Text maxW="300px" isTruncated>
                      Generate Random IDs from{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {wordList ? wordList.name : "Default Wordlist"}
                      </span>
                    </Text>
                  </Button>
                </Stack>
              )}
              <Textarea
                height="inherit"
                rows="6"
                value={data.validIdentifiers.join("\n")}
                onChange={({ target: { value } }) =>
                  mutate(
                    { ...data, validIdentifiers: value.split("\n") },
                    false
                  )
                }
                w="100%"
              />
            </VStack>
          )}
        </VStack>
      </Flex>
    </>
  );
};

export default ParticipantIdentifiersConfig;
