import { useState, useEffect } from "react";
import { Box, Flex, Button, Heading, Link, HStack } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { listWordlist } from "api/wordlist";
import { Page } from "components/core";
import LightHeading from "components/core/LightHeading";
import CreateWordlistModal from "./component/CreateWordlistModel";
import { ActionCard } from "components/shared/ActionCard";
import { Link as RouterLink } from "@reach/router";
import { DeleteWordlistModal } from "./component/DeleteWordlistModal";

const Wordlists = () => {
  const [wordLists, setWordLists] = useState([]);
  const [selectedWordlistId, setSelectedWordlistId] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const getWordLists = async () => {
      const results = await listWordlist();
      setWordLists(results);
    };
    getWordLists();
  }, []);

  const openCreateModal = () => setCreateModalOpen(true);
  const openDeleteModal = (id) => {
    setSelectedWordlistId(id);
    setDeleteModalOpen(true);
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
          onClick={openCreateModal}
        >
          Create a Wordlist
        </Button>
      </Flex>
      <Box p={2}>
        <ActionCard>
          <HStack justifyContent="space-between">
            <Link as={RouterLink} to={"defaultWordlist"}>
              <LightHeading
                textAlign="center"
                as="h4"
                size="lg"
                wordBreak="break-all"
                color="blue.500"
              >
                Default Wordlist
              </LightHeading>
            </Link>
          </HStack>
        </ActionCard>
      </Box>
      {wordLists.map((wordlist) => (
        <Box p={2} key={wordlist.id}>
          <ActionCard>
            <HStack justifyContent="space-between">
              <Link as={RouterLink} to={`${wordlist.id}`}>
                <LightHeading
                  textAlign="center"
                  as="h4"
                  size="lg"
                  wordBreak="break-all"
                  color="blue.500"
                >
                  {wordlist.name}
                </LightHeading>
              </Link>
              <Button
                colorScheme="red"
                leftIcon={<FaTrash />}
                onClick={(e) => openDeleteModal(wordlist.id)}
              >
                Delete
              </Button>
            </HStack>
          </ActionCard>
        </Box>
      ))}

      <CreateWordlistModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onAddWordList={setWordLists}
      />
      <DeleteWordlistModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        wordlistId={selectedWordlistId}
        onRemoveWordList={setWordLists}
      />
    </Page>
  );
};

export default Wordlists;
