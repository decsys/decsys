import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Flex,
  Button,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import WebhookActionCard from "./WebhookActionCard";

const WebhookModal = ({ isOpen, onClose, webhooks, handleWebhookAction }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="xl">
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
                  handleWebhookAction(specificWebhook);
                }}
              />
            </Box>
          ))}
      </ModalBody>
      <Flex align="start" direction="column" pl={8}>
        <Button
          colorScheme="green"
          size="sm"
          leftIcon={<FaPlus />}
          onClick={() => handleWebhookAction(null)}
        >
          Create a Webhook
        </Button>
      </Flex>
      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default WebhookModal;
