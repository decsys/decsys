import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  useDisclosure,
  LightMode,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { deleteWordlist } from "api/wordlist";
import { BarButton } from "app/pages/Editor/components/EditorBar/Buttons";

export const DeleteWordlistModal = ({
  isOpen,
  onClose,
  wordlistId,
  onRemoveWordList,
}) => {
  const toast = useToast();

  const handleDeleteWordlist = async () => {
    if (wordlistId) {
      try {
        const success = await deleteWordlist(wordlistId);
        if (success) {
          onRemoveWordList((prevWordLists) =>
            prevWordLists.filter((wl) => wl.id !== wordlistId)
          );
          onClose();
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
      } catch (error) {
        toast({
          title: "Deletion Error",
          description: `An error occurred: ${error.message}`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const DeleteButton = ({ wordlistId, onRemoveWordList }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <LightMode>
        <BarButton onClick={onOpen} leftIcon={<FaTrash />} colorScheme="red">
          Delete
        </BarButton>
      </LightMode>
      <DeleteWordlistModal
        isOpen={isOpen}
        onClose={onClose}
        wordlistId={wordlistId}
        onRemoveWordList={onRemoveWordList}
      />
    </>
  );
};
