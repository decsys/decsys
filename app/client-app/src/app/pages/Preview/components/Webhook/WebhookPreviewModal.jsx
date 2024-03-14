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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaClock, FaDownload, FaFileAlt } from "react-icons/fa";
import { exportDateFormat } from "services/date-formats";
import download from "downloadjs";
import JSZip from "jszip";
import { BusyPage } from "components/core";

const getPageName = (page, responses) => {
  if (!responses) {
    return null;
  }
  const responseItem = responses.find(
    (response) => response && response.page === page
  );
  return responseItem && responseItem.pageName ? responseItem.pageName : null;
};

const JSONModal = ({ isOpen, onClose, webhookPayloadData }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="xl">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>JSON Payload</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Code style={{ whiteSpace: "pre-wrap", backgroundColor: "white" }}>
          {JSON.stringify(webhookPayloadData, null, 2)}
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

const WebhookItem = ({ webhookData }) => {
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  const openJsonModal = () => setIsJsonModalOpen(true);
  const closeJsonModal = () => setIsJsonModalOpen(false);

  const pageName = getPageName(
    webhookData.eventType?.sourcePage,
    webhookData.payload?.responses ?? {}
  );

  return (
    <>
      <Flex
        bg="blue.50"
        boxShadow="0 4px 8px 0 rgba(0,0,0,0.2)"
        borderRadius="md"
        p={4}
        mb={3}
        flexDirection="column"
      >
        <HStack>
          <Icon as={FaClock} boxSize={6} color="gray.500" />
          <Badge
            colorScheme="white"
            fontSize={{ base: "xs", xl: "md" }}
            fontWeight="semibold"
          >
            Timestamp:{" "}
            {`${exportDateFormat(new Date(webhookData.timestamp)).date} ${
              exportDateFormat(new Date(webhookData.timestamp)).time
            } ${exportDateFormat(new Date(webhookData.timestamp)).tz}`}
          </Badge>
        </HStack>
        <HStack width="100%">
          <VStack spacing={2} pt={2}>
            <Badge colorScheme="blue" py={1} px={2} width="100%">
              Source Page: {webhookData.eventType.sourcePage}
            </Badge>
            {pageName && (
              <Badge colorScheme="blue" py={1} px={2} mt={2}>
                Page Name: {pageName}
              </Badge>
            )}
          </VStack>
          <Spacer />
          <Button
            size="sm"
            rightIcon={<Icon as={FaFileAlt} />}
            colorScheme="linkedin"
            variant="solid"
            fontSize={{ base: "10px", xl: "sm" }}
            onClick={openJsonModal}
          >
            Webhook Payload
          </Button>
        </HStack>
      </Flex>
      <JSONModal
        isOpen={isJsonModalOpen}
        onClose={closeJsonModal}
        webhookPayloadData={webhookData}
      />
    </>
  );
};

export const ExportPayloadButton = ({ triggeredHooks }) => {
  const [isExportingWebhooks, setIsExporting] = useState(false);

  const downloadTriggeredHooks = async () => {
    setIsExporting(true);
    const zip = new JSZip();

    triggeredHooks.forEach((webhookData, index) => {
      const filename = `Webhook_Payload_${index + 1}.json`;
      const jsonContent = JSON.stringify(webhookData, null, 2);
      zip.file(filename, jsonContent);
    });

    const content = await zip.generateAsync({ type: "blob" });
    download(content, "Triggered_Webhooks.zip", "application/zip");
    setIsExporting(false);
  };

  return (
    <Button
      size="md"
      rightIcon={!isExportingWebhooks ? <Icon as={FaDownload} /> : null}
      fontSize="md"
      colorScheme="pink"
      onClick={downloadTriggeredHooks}
      disabled={triggeredHooks.length === 0}
    >
      {isExportingWebhooks ? (
        <BusyPage verb="Exporting" />
      ) : (
        `${triggeredHooks.length === 1 ? "Export Payload" : "Export Payloads"}`
      )}{" "}
    </Button>
  );
};

export const WebhookPreviewBody = ({ triggeredHooks }) => {
  return (
    <Accordion allowToggle width="100%" px="2.5">
      <AccordionItem backgroundColor="gray.100">
        <AccordionButton>
          <Box flex="1" textAlign="left">
            Triggered Webhooks ({triggeredHooks.length})
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <ModalBody width="100%" pt="5px">
            {triggeredHooks.length > 0 ? (
              triggeredHooks.map((webhookData, idx) => (
                <WebhookItem key={idx} webhookData={webhookData} />
              ))
            ) : (
              <Text color="gray.500">No webhooks have been triggered.</Text>
            )}
          </ModalBody>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export const WebhookPreviewModal = ({
  isOpen,
  onClose,
  triggeredHooks,
  isSurveyComplete,
  navigateBack,
}) => (
  <>
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="black">
          {isSurveyComplete ? "Survey Completion" : "Webhooks"}
        </ModalHeader>
        <ModalCloseButton />
        <WebhookPreviewBody triggeredHooks={triggeredHooks} />
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
            <ExportPayloadButton triggeredHooks={triggeredHooks} />
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
);
