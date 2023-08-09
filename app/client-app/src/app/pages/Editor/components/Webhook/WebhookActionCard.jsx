import {
  Box,
  Flex,
  Heading,
  Text,
  IconButton,
  Badge,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { FaTrash, FaFilter } from "react-icons/fa";
import { ActionCard } from "components/shared/ActionCard";
import { deleteWebhook } from "api/webhooks";

const WebhookActionCard = ({ webhook }) => {
  console.log(webhook);
  const handleDelete = async () => {
    await deleteWebhook(webhook.id);
  };
  return (
    <ActionCard
      title={
        <Flex justify="space-between" align="center">
          <Heading as="h4" size="md" wordBreak="break-all">
            {webhook.callbackUrl}
          </Heading>
          <IconButton
            colorScheme="red"
            size="sm"
            icon={<FaTrash />}
            onClick={handleDelete}
          />
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
