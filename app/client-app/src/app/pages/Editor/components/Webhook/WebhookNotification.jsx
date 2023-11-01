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
import { FaBell, FaClock, FaFileAlt, FaRegBell } from "react-icons/fa";
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

export const WebhookNotification = ({
  webhookCount,
  unread,
  setUnread,
  setWebhookCount,
  triggeredHooks,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const handleClick = () => {
    setUnread(false);
    onOpen();
    setWebhookCount(0);
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
          onClick={handleClick}
        >
          <Flex align="center" position="relative">
            <Icon
              as={webhookCount > 0 && unread ? FaBell : FaRegBell}
              boxSize="24px"
            />
            {unread && (
              <Box
                position="absolute"
                top="-6px"
                right="-3px"
                backgroundColor="red"
                borderRadius="50%"
                width="18px"
                height="17px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="sm" color="white">
                  {webhookCount}
                </Text>
              </Box>
            )}
          </Flex>
        </Button>
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="blue.500" color="white">
            Triggered Webhooks
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={4}>
            {triggeredHooks.length > 0 ? (
              triggeredHooks.map((hook, idx) => {
                const getPageName = (page) => {
                  const responseItem = hook.payload.responses.find(
                    (response) => response.page === page
                  );
                  return responseItem ? responseItem.pageName : "Untitled Page";
                };
                return (
                  <Flex
                    bg="white"
                    boxShadow="0 4px 8px 0 rgba(0,0,0,0.2)"
                    borderRadius="md"
                    p={4}
                    mb={3}
                    key={idx}
                    flexDirection="column"
                  >
                    <HStack>
                      <Icon as={FaClock} boxSize={6} color="gray.500" />
                      <Badge
                        colorScheme="white"
                        fontSize="md"
                        fontWeight="semibold"
                      >
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
                          Page Name: {getPageName(hook.eventType.sourcePage)}
                        </Badge>
                      </VStack>
                      <Spacer />
                      <Button
                        size="sm"
                        leftIcon={<Icon as={FaFileAlt} />}
                        colorScheme="linkedin"
                        variant="solid"
                        onClick={() => setSelectedWebhook(hook)}
                      >
                        <Text fontSize="sm">Webhook Payload</Text>
                      </Button>
                    </HStack>
                  </Flex>
                );
              })
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
      <JSONModal
        isOpen={selectedWebhook !== null}
        onClose={() => setSelectedWebhook(null)}
        jsonData={selectedWebhook}
      />
    </>
  );
};
