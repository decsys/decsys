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
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { listWordlist, createWordList } from "api/wordlist";
import { Page } from "components/core";
import LightHeading from "components/core/LightHeading";
import { ActionCard } from "components/shared/ActionCard";
import { deleteWordlist } from "api/wordlist";

const Wordlists = () => {
  const [wordLists, setWordLists] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newWordListName, setNewWordListName] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWordlistId, setSelectedWordlistId] = useState(null);

  useEffect(() => {
    const getWordLists = async () => {
      const results = await listWordlist();
      setWordLists(results);
    };

    getWordLists();
  }, []);

  const toast = useToast();

  const handleCreateWordList = async () => {
    try {
      const newWordList = await createWordList(newWordListName);
      if (newWordList) {
        setWordLists((prevWordLists) => [...prevWordLists, newWordList]);
        setNewWordListName("");
        onClose();
        toast({
          title: "Wordlist Created",
          description: "Your new wordlist has been successfully created.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      } else {
        throw new Error("Creation failed due to server error.");
      }
    } catch (error) {
      toast({
        title: "Creation Failed",
        description:
          error.message || "Failed to create wordlist. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  const handleDeleteWordlist = async () => {
    if (selectedWordlistId) {
      const success = await deleteWordlist(selectedWordlistId);
      if (success) {
        setWordLists((prevWordLists) =>
          prevWordLists.filter((wl) => wl.id !== selectedWordlistId)
        );
        setIsDeleteModalOpen(false);
        toast({
          title: "Deletion Successful",
          description: "The wordlist has been successfully deleted.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      } else {
        toast({
          title: "Deletion Failed",
          description: "Failed to delete wordlist. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      }
    }
  };

  const handleOpenModal = () => {
    onOpen();
  };

  const openDeleteModal = (id) => {
    setSelectedWordlistId(id);
    setIsDeleteModalOpen(true);
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
                      onClick={() => openDeleteModal(wordlist.id)}
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
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Wordlist</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this wordlist? This action cannot be
            undone.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteWordlist}>
              Delete
            </Button>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Page>
  );
};

export default Wordlists;
