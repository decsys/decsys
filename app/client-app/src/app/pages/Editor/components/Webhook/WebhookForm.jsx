import { useRef } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Box,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  IconButton,
  Flex,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { FaTimes, FaPlusCircle } from "react-icons/fa";
import { TextField } from "../Form/TextField";
import { FormikInput } from "../Form/FormikInput";
import LightHeading from "components/core/LightHeading";
import { generateWebhookSecret } from "api/webhooks";
import ConfirmationModal from "./ConfirmationModal";

const WebhookForm = ({ isOpen, onClose, onSubmit }) => {
  const finalRef = useRef(null);
  const toast = useToast();
  const {
    isOpen: isConfirmationOpen,
    onOpen: onConfirmationOpen,
    onClose: onConfirmationClose,
  } = useDisclosure();

  const handleGenerateSecret = async (values, setFieldValue) => {
    if (values.secret) {
      // If it is filled, open a confirmation modal
      onConfirmationOpen();
    } else {
      // If it is not filled, generate a new secret directly
      const newSecret = await generateWebhookSecret();
      setFieldValue("secret", newSecret);
    }
  };

  return (
    <Modal finalFocusRef={finalRef} isOpen={isOpen} size="xl" onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a Webhook</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{
            url: "",
            secret: "",
            verifySsl: true,
            eventTrigger: "allEvents",
            sourcePages: [],
            hasCustomTriggers: false,
            pageNavigation: true,
          }}
          onSubmit={(values) => {
            if (values.eventTrigger === "customEvents") {
              values.hasCustomTriggers = true;
            } else {
              values.hasCustomTriggers = false;
            }
            onSubmit(values);
            toast({
              title: "Webhook Saved.",
              description: "Your webhook has been saved successfully.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            onClose();
          }}
        >
          {({ values, handleSubmit, setFieldValue }) => {
            const handleConfirmNewSecret = async () => {
              const newSecret = await generateWebhookSecret();
              setFieldValue("secret", newSecret);
              onConfirmationClose();
            };

            return (
              <Form id="myForm" onSubmit={handleSubmit}>
                <Box p={2}>
                  <VStack align="flex-start">
                    <TextField
                      name="url"
                      placeholder="Callback Url"
                      header="Header"
                      size="sm"
                    />
                    <HStack w="100%">
                      <TextField
                        name="secret"
                        placeholder="Secret"
                        header="Header"
                        size="sm"
                      />
                      <Button
                        size="sm"
                        colorScheme="teal"
                        w="40%"
                        onClick={() =>
                          handleGenerateSecret(values, setFieldValue)
                        }
                      >
                        Generate Secret
                      </Button>
                    </HStack>
                  </VStack>
                  <HStack pt="2">
                    <Field type="checkbox" name="verifySsl" />
                    <Text>Verify SSL</Text>
                  </HStack>
                  {!values.verifySsl && (
                    <Alert status="warning">
                      <VStack pl="2">
                        <HStack>
                          <AlertIcon />
                          <AlertTitle>
                            WARNING: Disabling SSL verification has serious
                            implications.
                          </AlertTitle>
                        </HStack>
                        <AlertDescription fontSize="sm">
                          SSL verification helps ensure that hook payloads are
                          delivered to your URL endpoint securely, keeping your
                          data away from prying eyes. Disabling this option is
                          not recommended.
                        </AlertDescription>
                      </VStack>
                    </Alert>
                  )}
                  <VStack align="flex-start">
                    <LightHeading textAlign="center" size="md" pt="2">
                      Trigger Criteria
                    </LightHeading>
                    <HStack>
                      <Field
                        type="radio"
                        name="eventTrigger"
                        value="allEvents"
                      />
                      <Text>All Events</Text>
                      <Field
                        type="radio"
                        name="eventTrigger"
                        value="customEvents"
                      />
                      <Text>Customize Events</Text>
                    </HStack>
                  </VStack>
                  {values.eventTrigger === "customEvents" && (
                    <FieldArray name="sourcePages">
                      {({ push, remove }) => (
                        <Accordion
                          borderWidth={1}
                          borderRadius={5}
                          defaultIndex={[0]}
                          allowToggle
                          pl="2"
                        >
                          <AccordionItem>
                            <AccordionButton width="100%">
                              <Box textAlign="left">
                                <HStack>
                                  <Field
                                    type="checkbox"
                                    name="pageNavigation"
                                  />
                                  <Text>Page Navigation</Text>
                                </HStack>
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                              <VStack w="100%" align="flex-start">
                                <Text fontSize="sm">
                                  Please specify the page numbers of the survey,
                                  on which an event should trigger the webhook
                                </Text>
                                <Box w="100%" borderWidth={1} borderRadius={5}>
                                  <HStack
                                    w="100%"
                                    p="2"
                                    justify="space-between"
                                  >
                                    <LightHeading
                                      textAlign="center"
                                      as="h4"
                                      size="md"
                                    >
                                      Trigger Filters
                                    </LightHeading>
                                    <IconButton
                                      colorScheme="green"
                                      icon={<FaPlusCircle />}
                                      onClick={() => push("")}
                                    />
                                  </HStack>
                                  {values.sourcePages.map(
                                    (sourcePage, index) => (
                                      <Flex key={index} w="100%">
                                        <HStack w="100%" p="2">
                                          <Flex w="40%">
                                            <FormikInput
                                              name={`sourcePages.${index}`}
                                              placeholder="Source page (number)"
                                              type="number"
                                              size="sm"
                                              collapseError
                                            />
                                          </Flex>
                                          <IconButton
                                            colorScheme="red"
                                            size="sm"
                                            icon={<FaTimes />}
                                            onClick={() => remove(index)}
                                          />
                                        </HStack>
                                      </Flex>
                                    )
                                  )}
                                </Box>
                              </VStack>
                            </AccordionPanel>
                          </AccordionItem>
                        </Accordion>
                      )}
                    </FieldArray>
                  )}
                  <ModalFooter>
                    <Button colorScheme="red" mr={3} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button colorScheme="blue" type="submit">
                      Save
                    </Button>
                  </ModalFooter>
                </Box>
                <ConfirmationModal
                  isOpen={isConfirmationOpen}
                  onClose={onConfirmationClose}
                  onConfirm={() => handleConfirmNewSecret(setFieldValue)}
                />
              </Form>
            );
          }}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default WebhookForm;
