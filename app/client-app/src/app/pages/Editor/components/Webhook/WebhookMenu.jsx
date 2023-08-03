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
  Badge,
  Heading,
  Text,
  Box,
  HStack,
} from "@chakra-ui/react";
import { FaEllipsisV, FaPlus } from "react-icons/fa";
import { useRef, useEffect, useState } from "react";
import { useFetchSurvey } from "app/contexts/FetchSurvey";
import { createWebhook, useWebhook } from "api/webhooks";
import WebhookForm from "./WebhookForm";
import { ActionCard } from "components/shared/ActionCard";
import { FaTrash, FaFilter } from "react-icons/fa";

const WebhookMenu = () => {
  const [badgeProperties, setBadgeProperties] = useState([]);

  const { id: surveyId } = useFetchSurvey();
  const { data, mutate } = useWebhook(surveyId);

  console.log(data);

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
    mutate();
    onFormClose();
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

          <ModalBody>
            {data &&
              data.map((webhook) => (
                <Box p={2} key={webhook.callbackUrl}>
                  <ActionCard
                    title={
                      <Flex justify="space-between" align="center">
                        <Heading as="h4" size="md">
                          {webhook.callbackUrl}
                        </Heading>
                        <IconButton
                          colorScheme="red"
                          size="sm"
                          icon={<FaTrash />}
                        />
                      </Flex>
                    }
                  >
                    <Text>
                      {!webhook.triggerCriteria.hasCustomTriggers && (
                        <Badge colorScheme="green" p={1}>
                          <Text>Trigger on every event</Text>
                        </Badge>
                      )}
                      {webhook.triggerCriteria.eventTypes.PAGE_NAVIGATION !==
                        null &&
                        webhook.triggerCriteria.eventTypes.PAGE_NAVIGATION
                          .length === 0 &&
                        webhook.triggerCriteria.hasCustomTriggers && (
                          <Badge colorScheme="blue" p={1}>
                            <HStack spacing={2}>
                              <Text>Page Navigation</Text>
                            </HStack>
                          </Badge>
                        )}
                      {webhook.triggerCriteria.eventTypes.PAGE_NAVIGATION !==
                        null &&
                        webhook.triggerCriteria.eventTypes.PAGE_NAVIGATION
                          .length > 0 &&
                        webhook.triggerCriteria.hasCustomTriggers && (
                          <Badge colorScheme="blue" p={1}>
                            <HStack spacing={2}>
                              <Text>Page Navigation with filters</Text>
                              <FaFilter />
                            </HStack>
                          </Badge>
                        )}
                    </Text>
                  </ActionCard>
                </Box>
              ))}
          </ModalBody>

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
