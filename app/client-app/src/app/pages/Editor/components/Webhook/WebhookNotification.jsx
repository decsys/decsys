import {
  Badge,
  Box,
  Button,
  Code,
  Flex,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  FaBell,
  FaClock,
  FaDownload,
  FaFileAlt,
  FaRegBell,
} from "react-icons/fa";
import { exportDateFormat } from "services/date-formats";

const JSONModal = ({ isOpen, onClose, jsonData }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="xl">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>JSON Payload</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Code style={{ whiteSpace: "pre-wrap", backgroundColor: "white" }}>
          {JSON.stringify(jsonData, null, 2)}
        </Code>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

const getPageName = (page, responses) => {
  const responseItem = responses.find((response) => response.page === page);
  return responseItem ? responseItem.pageName : "Untitled Page";
};

const WebhookNotification = ({
  webhookCount,
  unread,
  setUnread,
  setWebhookCount,
  triggeredHooks,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedWebhook, setSelectedWebhook] = useState(null);

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
      <WebhooksModal
        isOpen={isOpen}
        onClose={onClose}
        triggeredHooks={triggeredHooks}
        onWebhookSelect={setSelectedWebhook}
      />
      <JSONModal
        isOpen={selectedWebhook !== null}
        onClose={() => setSelectedWebhook(null)}
        jsonData={selectedWebhook}
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

const WebhooksModal = ({
  isOpen,
  onClose,
  triggeredHooks,
  onWebhookSelect,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader bg="blue.500" color="white">
        Triggered Webhooks
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody py={4}>
        {triggeredHooks.length > 0 ? (
          triggeredHooks.map((hook, idx) => (
            <WebhookItem key={idx} hook={hook} onSelect={onWebhookSelect} />
          ))
        ) : (
          <Text color="gray.500">No webhooks have been triggered.</Text>
        )}
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

const WebhookItem = ({ hook, onSelect }) => (
  <Flex
    bg="white"
    boxShadow="0 4px 8px 0 rgba(0,0,0,0.2)"
    borderRadius="md"
    p={4}
    mb={3}
    flexDirection="column"
  >
    <HStack>
      <Icon as={FaClock} boxSize={6} color="gray.500" />
      <Badge colorScheme="white" fontSize="md" fontWeight="semibold">
        Timestamp:{" "}
        {`${exportDateFormat(new Date(hook.timestamp)).date} ${
          exportDateFormat(new Date(hook.timestamp)).time
        } ${exportDateFormat(new Date(hook.timestamp)).tz}`}
      </Badge>
    </HStack>
    <HStack width="100%">
      <VStack spacing={2} pt={2} align="stretch">
        <Badge colorScheme="blue" py={2} px={2}>
          Source Page: {hook.eventType.sourcePage}
        </Badge>
        <Badge colorScheme="blue" py={2} px={2}>
          Page Name:{" "}
          {getPageName(hook.eventType.sourcePage, hook.payload.responses)}
        </Badge>
      </VStack>
      <Spacer />
      <VStack align="stretch" pt="0.5">
        <Button
          size="sm"
          rightIcon={<Icon as={FaFileAlt} />}
          colorScheme="linkedin"
          variant="solid"
          fontSize="sm"
          onClick={() => onSelect(hook)}
        >
          Webhook Payload
        </Button>
        <Button
          size="sm"
          rightIcon={<Icon as={FaDownload} />}
          colorScheme="gray"
          variant="solid"
          fontSize="sm"
        >
          Download Payload
        </Button>
      </VStack>
    </HStack>
  </Flex>
);

export default WebhookNotification;
