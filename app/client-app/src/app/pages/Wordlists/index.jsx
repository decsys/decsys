import { Box, Button, Flex, Heading, IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

import { listWordlist } from "api/wordlist";
import { Page } from "components/core";
import LightHeading from "components/core/LightHeading";
import { ActionCard } from "components/shared/ActionCard";
import { createWordList } from "api/wordlist";

const Wordlists = () => {
  const [wordLists, setWordLists] = useState([]);

  useEffect(() => {
    const getWordLists = async () => {
      const results = await listWordlist();
      setWordLists(results);
    };

    getWordLists();
  }, []);

  const handleCreateWordList = async () => {
    const newWordList = await createWordList();
    setWordLists((prevWordLists) => [...prevWordLists, newWordList]);
  };

  return (
    <Page>
      <Flex justifyContent="space-between" alignItems="center" px="2" py="4">
        <LightHeading as="h1" size="xl">
          My Wordlists
        </LightHeading>
        <Button
          leftIcon={<FaPlus />}
          size="md"
          colorScheme="green"
          onClick={handleCreateWordList}
        >
          Create a Wordlist
        </Button>
      </Flex>
      <Box p={2}>
        {wordLists.map((wordlist) => (
          <Box mb={4} key={wordlist.id}>
            <ActionCard
              title={
                <Flex justify="space-between" align="center">
                  <Heading as="h4" size="md" wordBreak="break-all">
                    {wordlist.name}
                  </Heading>
                  <Flex width="65px">
                    <IconButton
                      colorScheme="blue"
                      size="sm"
                      icon={<FaEdit />}
                      mr={2}
                    />
                    <IconButton
                      colorScheme="red"
                      size="sm"
                      icon={<FaTrash />}
                    />
                  </Flex>
                </Flex>
              }
            />
          </Box>
        ))}
      </Box>
    </Page>
  );
};

export default Wordlists;
