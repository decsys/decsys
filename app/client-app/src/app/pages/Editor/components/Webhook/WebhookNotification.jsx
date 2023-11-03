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
import download from "downloadjs";
import JSZip from "jszip";

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
  return responseItem.pageName ? responseItem.pageName : "Untitled Page";
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
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const downloadTriggeredHooks = async () => {
    setIsExporting(true);
    const zip = new JSZip();

    triggeredHooks.forEach((hook, index) => {
      const filename = `payload_${index + 1}.json`;
      const jsonContent = JSON.stringify(hook, null, 2);
      zip.file(filename, jsonContent);
    });

    const content = await zip.generateAsync({ type: "blob" });
    download(content, "TriggeredWebhookHooks.zip", "application/zip");
    setIsExporting(false);
  };

  return (
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
          {triggeredHooks.length > 0 && (
            <Button
              size="md"
              rightIcon={<Icon as={FaDownload} />}
              colorScheme="gray"
              variant="solid"
              fontSize="md"
              onClick={downloadTriggeredHooks}
              isLoading={isExporting}
              loadingText="Exporting"
            >
              {triggeredHooks.length === 1
                ? "Download Payload"
                : "Download Payloads"}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

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
      <VStack spacing={2} pt={2}>
        <Badge colorScheme="blue" py={1} px={2} width="100%">
          Source Page: {hook.eventType.sourcePage}
        </Badge>
        <Badge colorScheme="blue" py={1} px={2} mt={2}>
          Page Name:{" "}
          {getPageName(hook.eventType.sourcePage, hook.payload.responses)}
        </Badge>
      </VStack>
      <Spacer />
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
    </HStack>
  </Flex>
);
export default WebhookNotification;
