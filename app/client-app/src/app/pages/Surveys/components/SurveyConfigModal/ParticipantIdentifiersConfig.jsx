import { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaExternalLinkAlt,
  FaInfoCircle,
} from "react-icons/fa";
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
        <VStack w="95%">
          <Button
            size="md"
            colorScheme="green"
            as="a"
            href="/admin/wordlists/"
            w="100%"
            rightIcon={<FaExternalLinkAlt />}
          >
            Manage Wordlists
          </Button>

          {wordLists && (
            <Select
              placeholder="Select wordlist to generate identifiers"
              onChange={({ target: { value } }) => setSelectedWordlistId(value)}
            >
              {wordLists.map((wordlist) => (
                <option key={wordlist.id} value={wordlist.id}>
                  {wordlist.name}
                </option>
              ))}
            </Select>
          )}

          {(selectedWordlistId || data.validIdentifiers.length > 0) && (
            <VStack align="stretch">
              {selectedWordlistId && (
                <Stack direction="row">
                  <Flex>
                    <Input
                      size="sm"
                      type="number"
                      width="100px"
                      value={idGenCount}
                      onChange={handleGenCountChange}
                    />
                  </Flex>
                  <Button
                    size="sm"
                    colorScheme="gray"
                    onClick={handleIdGenClick}
                  >
                    <Text maxW="300px" isTruncated>
                      Generate Random IDs from{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {wordList.name}
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
              />
            </VStack>
          )}
        </VStack>
      </Flex>
    </>
  );
};

export default ParticipantIdentifiersConfig;
