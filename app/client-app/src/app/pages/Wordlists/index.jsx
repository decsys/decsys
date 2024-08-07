import { useState, useEffect } from "react";
import { Box, Flex, Button, Heading, IconButton, Link } from "@chakra-ui/react";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
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
      {wordLists.map((wordlist) => (
        <Box p={2} key={wordlist.id}>
          <ActionCard
            title={
              <Flex justify="space-between" align="center">
                <Heading as="h4" size="md" wordBreak="break-all">
                  {wordlist.name}
                </Heading>
                <Flex>
                  <Link as={RouterLink} to={`${wordlist.id}`}>
                    <Button colorScheme="blue" leftIcon={<FaEdit />} mr="4">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    colorScheme="red"
                    leftIcon={<FaTrash />}
                    onClick={() => {
                      openDeleteModal(wordlist.id);
                    }}
                  >
                    Delete
                  </Button>
                </Flex>
              </Flex>
            }
          />
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
