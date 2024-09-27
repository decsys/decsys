import {
  Box,
  Badge,
  Heading,
  Button,
  Icon,
  Stack,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  ModalOverlay,
  ModalBody,
  useToast,
} from "@chakra-ui/react";
import { FaPlusCircle, FaMinusCircle, FaTrash } from "react-icons/fa";
import { ActiveIndicator } from "components/core";
import { deleteCustomWord } from "api/wordlist";
import { useEffect, useRef } from "react";
import { useWordData } from "../hooks/useWordData";

export const WordCard = ({
  word,
  type,
  isExcludedBuiltin,
  onToggleExclude,
  isDefaultWordlist,
  isCustomWord,
  wordlistId,
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const { mutate } = useWordData(wordlistId);

  const handleDelete = async () => {
    const success = await deleteCustomWord(wordlistId, type, word);
    if (success) {
      mutate();
      onClose();
      toast({
        title: "Deletion Successful",
        description: "The custom word has been successfully deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } else {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete word. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  return (
    <Stack spacing={0} direction="row" bg="gray.200">
      <ActiveIndicator active={!isExcludedBuiltin} />
      <Stack w="100%">
        <Box
          backgroundColor="gray.100"
          padding="10px"
          marginBottom="1px"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box flex="1">
            <Heading size="md">{word}</Heading>
          </Box>
          <Box flex="1" display="flex" justifyContent="center">
            {isCustomWord && (
              <Badge
                variant="subtle"
                colorScheme="red"
                padding="5px"
                fontSize="l"
                fontWeight="bold"
                mr="2"
              >
                Custom
              </Badge>
            )}
            <Badge
              variant="subtle"
              colorScheme="blue"
              padding="5px"
              fontSize="l"
              fontWeight="bold"
            >
              {type}
            </Badge>
          </Box>
          <Box flex="1" display="flex" justifyContent="flex-end">
            {!isDefaultWordlist && isCustomWord && (
              <Button
                leftIcon={<FaTrash />}
                colorScheme="red"
                mr="2"
                variant="outline"
                onClick={onOpen}
              >
                Delete
              </Button>
            )}
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Delete a Custom Word</ModalHeader>
                <ModalBody>Would you like to delete {word}?</ModalBody>
                <ModalFooter>
                  <Button colorScheme="red" mr={3} onClick={handleDelete}>
                    Delete
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            {!isDefaultWordlist && (
              <Button
                onClick={() => onToggleExclude(word, type, isExcludedBuiltin)}
                leftIcon={
                  isExcludedBuiltin ? <FaPlusCircle /> : <FaMinusCircle />
                }
                bg={isExcludedBuiltin ? "blue.500" : "red.500"}
                color="white"
                _hover={{
                  bg: isExcludedBuiltin ? "blue.600" : "red.600",
                }}
              >
                {isExcludedBuiltin ? "Unblock" : "Block"}
              </Button>
            )}
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
};
