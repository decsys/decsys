import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
} from "@chakra-ui/react";
import { FaEllipsisV, FaPlus } from "react-icons/fa";
import { useRef } from "react";
import { createWebhook } from "api/webhook";

const WebhookMenu = () => {
  const {
    isOpen: isWebhooksModalOpen,
    onOpen: openWebhooksModal,
    onClose: closeWebhooksModal,
  } = useDisclosure();
  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();
  const finalRef = useRef(null);

  const handleAddWebhook = () => {
    onFormOpen();
  };

  return (
    <>
      <Menu>
        <MenuButton
          border="thin solid"
          borderColor="gray.500"
          as={IconButton}
          icon={<FaEllipsisV />}
          boxSize={"40px"}
        />
        <MenuList>
          <MenuItem onClick={openWebhooksModal}>Manage Webhooks ...</MenuItem>
        </MenuList>
      </Menu>

      <Modal
        finalFocusRef={finalRef}
        isOpen={isWebhooksModalOpen}
        onClose={closeWebhooksModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Webhooks</ModalHeader>
          <ModalCloseButton />
          <ModalBody>sample text - existing Webhooks</ModalBody>
          <Flex align="start" direction="column" pl={6}>
            <Button
              colorScheme="green"
              size="sm"
              leftIcon={<FaPlus />}
              onClick={handleAddWebhook}
            >
              New Webhook
            </Button>
          </Flex>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeWebhooksModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal finalFocusRef={finalRef} isOpen={isFormOpen} onClose={onFormClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Webhook</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Webhook form</FormLabel>
              <Input />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onFormClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onFormClose}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WebhookMenu;
