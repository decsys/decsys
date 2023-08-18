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
  Box,
} from "@chakra-ui/react";
import { FaEllipsisV, FaPlus } from "react-icons/fa";
import WebhookActionCard from "./WebhookActionCard";

const WebhooksModal = ({
  finalRef,
  webhooks,
  onAddWebhook,
  onFormOpen,
  handleAddOrEditWebhook,
}) => {
  const {
    isOpen: isWebhooksModalOpen,
    onOpen: openWebhooksModal,
    onClose: closeWebhooksModal,
  } = useDisclosure();

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

          <ModalBody>
            {webhooks &&
              webhooks.map((webhook) => (
                <Box p={2} key={webhook.id}>
                  <WebhookActionCard
                    webhook={webhook}
                    onEditWebhook={(specificWebhook) => {
                      onFormOpen();
                      handleAddOrEditWebhook(specificWebhook);
                    }}
                  />
                </Box>
              ))}
          </ModalBody>

          <Flex align="start" direction="column" pl={6}>
            <Button
              colorScheme="green"
              size="sm"
              leftIcon={<FaPlus />}
              onClick={onAddWebhook}
            >
              Create a Webhook
            </Button>
          </Flex>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeWebhooksModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WebhooksModal;
