import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { listWordlist, createWordList } from "api/wordlist";
import { Page } from "components/core";
import LightHeading from "components/core/LightHeading";
import { ActionCard } from "components/shared/ActionCard";

const Wordlists = () => {
  const [wordLists, setWordLists] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newWordListName, setNewWordListName] = useState("");

  useEffect(() => {
    const getWordLists = async () => {
      const results = await listWordlist();
      setWordLists(results);
    };

    getWordLists();
  }, []);

  const handleCreateWordList = async () => {
    const newWordList = await createWordList(newWordListName);
    setWordLists((prevWordLists) => [...prevWordLists, newWordList]);
    setNewWordListName("");
    onClose();
  };

  const handleOpenModal = () => {
    onOpen();
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
          onClick={handleOpenModal}
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a New Wordlist</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Untitled Wordlist"
              value={newWordListName}
              onChange={(e) => setNewWordListName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateWordList}>
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Page>
  );
};

export default Wordlists;
