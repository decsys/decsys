import {
  Box,
  Button,
  Flex,
  Icon,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FaBell, FaRegBell } from "react-icons/fa";
import WebhooksPreviewModal from "./WebhooksPreviewModal";

const WebhookNotification = ({
  webhookCount,
  unread,
  setUnread,
  setWebhookCount,
  triggeredHooks,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleButtonClick = () => {
    setUnread(false);
    setWebhookCount(0);
    onOpen();
  };

  return (
    <>
      <Stack direction="row" align="center" spacing={1}>
        <Button
          size="lg"
          colorScheme="teal"
          variant="outline"
          borderWidth="2px"
          mr={2}
          onClick={handleButtonClick}
        >
          <Flex align="center" position="relative">
            <Icon
              as={webhookCount > 0 && unread ? FaBell : FaRegBell}
              boxSize="24px"
            />
            {unread && <NotificationBadge count={webhookCount} />}
          </Flex>
        </Button>
      </Stack>
      <WebhooksPreviewModal
        isOpen={isOpen}
        onClose={onClose}
        triggeredHooks={triggeredHooks}
      />
    </>
  );
};

const NotificationBadge = ({ count }) => (
  <Box
    position="absolute"
    top="-6px"
    right="-3px"
    backgroundColor="red"
    borderRadius="50%"
    width="18px"
    height="17px"
  >
    <Text fontSize="sm" color="white">
      {count}
    </Text>
  </Box>
);

export default WebhookNotification;
