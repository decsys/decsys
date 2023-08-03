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
import { createWebhook, listWebhook } from "api/webhooks";
import WebhookForm from "./WebhookForm";
import { ActionCard } from "components/shared/ActionCard";
import { FaTrash, FaFilter } from "react-icons/fa";

const WebhookMenu = () => {
  const [badgeProperties, setBadgeProperties] = useState([]);

  useEffect(() => {
    const getWebhookList = async () => {
      return await listWebhook(surveyId);
    };

    const getBadgePropertiesFromData = (data) => {
      return data.map((item) => {
        if (!item.triggerCriteria.hasCustomTriggers) {
          return { colorScheme: "green", text: "Trigger on all" };
        } else if (item.triggerCriteria.eventTypes.PAGE_NAVIGATION == null) {
          return { colorScheme: "blue", text: "Page Navigation" };
        } else {
          return { colorScheme: "orange", text: "Page Navigation" };
        }
      });
    };

    const fetchData = async () => {
      const data = await getWebhookList();
      const badgeProps = getBadgePropertiesFromData(data);
      setBadgeProperties(badgeProps);
    };

    fetchData();
  }, []);

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
          <ModalBody>
            {badgeProperties.map((badgeProp, index) => (
              <Box key={index} p={2}>
                <ActionCard
                  key={index}
                  title={
                    <Flex justify="space-between" align="center">
                      <Heading as="h4" size="md">
                        Callback url
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
                    <Badge colorScheme={badgeProp.colorScheme} p={1}>
                      <HStack spacing={2}>
                        <Text>{badgeProp.text}</Text>
                        {badgeProp.colorScheme === "orange" && <FaFilter />}
                      </HStack>
                    </Badge>
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
