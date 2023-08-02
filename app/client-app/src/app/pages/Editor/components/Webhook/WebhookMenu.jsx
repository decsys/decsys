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
} from "@chakra-ui/react";
import { FaEllipsisV, FaPlus } from "react-icons/fa";
import { useRef, useEffect } from "react";
import { useFetchSurvey } from "app/contexts/FetchSurvey";
import { createWebhook, listWebhook } from "api/webhooks";
import WebhookForm from "./WebhookForm";

const WebhookMenu = () => {
  const { id: surveyId } = useFetchSurvey();

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

  const getWebhookList = async () => {
    const data = await listWebhook(surveyId);
    console.log(data);
  };

  const handleSubmit = async (values) => {
    const {
      verifySsl,
      url,
      sourcePages,
      hasCustomTriggers,
      secret,
      pageNavigation,
    } = values;
    await createWebhook(
      surveyId,
      url,
      secret,
      verifySsl,
      sourcePages,
      hasCustomTriggers,
      pageNavigation
    );
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
      <WebhookForm
        isOpen={isFormOpen}
        onClose={onFormClose}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default WebhookMenu;
