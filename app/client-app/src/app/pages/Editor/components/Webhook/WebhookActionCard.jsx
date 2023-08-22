import {
  Flex,
  Heading,
  Text,
  IconButton,
  Badge,
  HStack,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { FaTrash, FaFilter, FaEdit } from "react-icons/fa";
import { ActionCard } from "components/shared/ActionCard";
import { deleteWebhook, useWebhook } from "api/webhooks";

const WebhookActionCard = ({ webhook, onEditWebhook }) => {
  const { mutate } = useWebhook(webhook.surveyId);
  const toast = useToast();
  const handleDelete = async () => {
    try {
      await deleteWebhook(webhook.id);
      toast({
        title: "Webhook Deleted",
        description: "The webhook was successfully deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      mutate();
    } catch (error) {
      toast({
        title: "Error Deleting Webhook",
        description:
          error.message || "There was an error deleting the webhook.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEdit = () => {
    onEditWebhook(webhook);
  };

  return (
    <ActionCard
      title={
        <Flex justify="space-between" align="center">
          <Heading as="h4" size="md" wordBreak="break-all">
            {webhook.callbackUrl}
          </Heading>
          <Flex width="65px">
            <IconButton
              colorScheme="blue"
              size="sm"
              icon={<FaEdit />}
              onClick={handleEdit}
              mr={2}
            />
            <IconButton
              colorScheme="red"
              size="sm"
              icon={<FaTrash />}
              onClick={handleDelete}
            />
          </Flex>
        </Flex>
      }
    >
      {!webhook.triggerCriteria.hasCustomTriggers && (
        <Badge colorScheme="green" p={1} width="50%">
          Trigger on every event
        </Badge>
      )}
      {webhook.triggerCriteria.eventTypes.PAGE_NAVIGATION !== null &&
        webhook.triggerCriteria.eventTypes.PAGE_NAVIGATION.length === 0 &&
        webhook.triggerCriteria.hasCustomTriggers && (
          <Badge colorScheme="blue" p={1} width="35%">
            Page Navigation
          </Badge>
        )}
      {webhook.triggerCriteria.eventTypes.PAGE_NAVIGATION !== null &&
        webhook.triggerCriteria.eventTypes.PAGE_NAVIGATION.length > 0 &&
        webhook.triggerCriteria.hasCustomTriggers && (
          <Badge colorScheme="blue" p={1} width="67%">
            <HStack>
              <Text>Page Navigation with filters</Text>
              <Icon as={FaFilter} />
            </HStack>
          </Badge>
        )}
    </ActionCard>
  );
};

export default WebhookActionCard;
