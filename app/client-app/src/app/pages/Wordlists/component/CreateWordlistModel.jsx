import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { createWordList } from "api/wordlist";

const CreateWordlistModal = ({ isOpen, onClose, onAddWordList }) => {
  const [newWordListName, setNewWordListName] = useState("");
  const toast = useToast();

  const handleCreateWordList = async () => {
    try {
      const newWordList = await createWordList(newWordListName);
      if (newWordList) {
        onAddWordList((prevWordLists) => [...prevWordLists, newWordList]);
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

  return (
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
  );
};

export default CreateWordlistModal;
