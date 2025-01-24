import {
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  Input,
  ModalFooter,
  FormLabel,
} from "@chakra-ui/react";
import { useFolders } from "api/folder";
import { checkExistingFolder, createFolder } from "api/folder";
import { useState } from "react";

export const AddFolderModal = ({ modalState, mutateSurveys }) => {
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");
  const toast = useToast();
  const { mutate } = useFolders();

  const handleFolderCreate = async () => {
    if (!folderName) {
      setError("Folder name cannot be empty.");
      return;
    }
    const existingFolder = await checkExistingFolder(folderName);

    if (existingFolder.name == folderName) {
      setError("Folder name already exists. Please choose a unique name.");
      return;
    }

    const response = await createFolder(folderName);

    if (response) {
      toast({
        title: "Folder created.",
        description: `Folder "${folderName}" was successfully created.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      mutate();
      mutateSurveys();
    } else {
      toast({
        title: "Failed to create a folder",
        description: "Failed to create a folder. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setFolderName("");
    setError("");
    modalState.onClose();
  };

  return (
    <Modal isOpen={modalState.isOpen} onClose={modalState.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a Folder</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={!!error}>
            <FormLabel>Folder Name</FormLabel>
            <Input
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value);
                setError("");
              }}
            />
            {error && (
              <p
                style={{
                  color: "red",
                  fontSize: "0.875em",
                  marginTop: "4px",
                }}
              >
                {error}
              </p>
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleFolderCreate}>
            Create
          </Button>
          <Button variant="ghost" onClick={modalState.onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
