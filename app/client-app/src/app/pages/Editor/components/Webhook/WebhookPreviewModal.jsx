import {
  Badge,
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
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaClock, FaDownload, FaFileAlt } from "react-icons/fa";
import { exportDateFormat } from "services/date-formats";
import download from "downloadjs";
import JSZip from "jszip";
import { BusyPage } from "components/core";

const getPageName = (page, responses) => {
  const responseItem = responses.find((response) => response.page === page);
  return responseItem.pageName ? responseItem.pageName : "Untitled Page";
};

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

const WebhookItem = ({ hook }) => {
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  const openJsonModal = () => setIsJsonModalOpen(true);
  const closeJsonModal = () => setIsJsonModalOpen(false);

  return (
    <>
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
            onClick={openJsonModal}
          >
            Webhook Payload
          </Button>
        </HStack>
      </Flex>
      <JSONModal
        isOpen={isJsonModalOpen}
        onClose={closeJsonModal}
        jsonData={hook}
      />
    </>
  );
};

export const ExportHooksButton = ({ triggeredHooks }) => {
  const [isExporting, setIsExporting] = useState(false);

  const downloadTriggeredHooks = async () => {
    setIsExporting(true);
    const zip = new JSZip();

    triggeredHooks.forEach((hook, index) => {
      const filename = `Webhook_Payload_${index + 1}.json`;
      const jsonContent = JSON.stringify(hook, null, 2);
      zip.file(filename, jsonContent);
    });

    const content = await zip.generateAsync({ type: "blob" });
    download(content, "Triggered_Webhooks.zip", "application/zip");
    setIsExporting(false);
  };

  return (
    <Button
      size="md"
      rightIcon={!isExporting ? <Icon as={FaDownload} /> : null}
      colorScheme="purple"
      variant="solid"
      fontSize="md"
      onClick={downloadTriggeredHooks}
      disabled={triggeredHooks.length === 0}
    >
      {isExporting ? (
        <BusyPage verb="Exporting" />
      ) : (
        `${triggeredHooks.length === 1 ? "Export Payload" : "Export Payloads"}`
      )}{" "}
    </Button>
  );
};

export const WebhooksPreviewBody = ({ triggeredHooks }) => {
  return (
    <ModalBody width="100%">
      {triggeredHooks.length > 0 ? (
        triggeredHooks.map((hook, idx) => <WebhookItem key={idx} hook={hook} />)
      ) : (
        <Text color="gray.500">No webhooks have been triggered.</Text>
      )}
    </ModalBody>
  );
};

export const WebhookPreviewModal = ({
  isOpen,
  onClose,
  triggeredHooks,
  isSurveyComplete,
  navigateBack,
}) => {
  const closeAndClear = () => {
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={closeAndClear}
        isCentered
        size="xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="blue.500" color="white">
            {isSurveyComplete ? "Survey Completion" : "Triggered Webhooks"}
          </ModalHeader>
          <ModalCloseButton />
          <WebhooksPreviewBody triggeredHooks={triggeredHooks} />
          <ModalFooter>
            {isSurveyComplete && (
              <Button
                size="md"
                colorScheme="blue"
                variant="outline"
                fontSize="md"
                mr={3}
                onClick={navigateBack}
              >
                Return to Survey Admin
              </Button>
            )}
            {triggeredHooks.length > 0 && (
              <ExportHooksButton triggeredHooks={triggeredHooks} />
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
