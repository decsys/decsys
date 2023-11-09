import { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import {
  Modal,
  ModalOverlay,
  ModalBody,
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
import { generateWebhookSecret } from "api/webhooks";
import ConfirmationModal from "./ConfirmationModal";

const CreateModeSecretField = ({
  values,
  handleGenerateSecret,
  setFieldValue,
}) => {
  return (
    <HStack w="100%" pt="4">
      <TextField name="secret" placeholder="Secret" header="Header" size="sm" />
      <Button
        size="sm"
        colorScheme="teal"
        w="40%"
        onClick={() => handleGenerateSecret(values, setFieldValue)}
      >
        Generate Secret
      </Button>
    </HStack>
  );
};

const InfoAlert = () => (
  <Alert status="info" mt={4}>
    <VStack>
      <HStack>
        <AlertIcon />
        <AlertTitle>Info: Changing Secret May Affect Integrations</AlertTitle>
      </HStack>
      <AlertDescription fontSize="sm">
        To change the secret, please input a new value. An empty field signifies
        the removal of the current secret. For continuity, you may cancel the
        editing process and retain the existing secret.
      </AlertDescription>
    </VStack>
  </Alert>
);

const WarningAlert = () => (
  <Alert status="warning" mt={4}>
    <VStack>
      <HStack>
        <AlertIcon />
        <AlertTitle>Warning: Update Secret with Care</AlertTitle>
      </HStack>
      <AlertDescription fontSize="sm">
        If you've lost or forgotten this secret, you can change it, but be aware
        that any integrations using this secret will need to be updated.
      </AlertDescription>
    </VStack>
  </Alert>
);

const EditSecretField = ({ handleGenerateSecret, values, setFieldValue }) => (
  <>
    <InfoAlert />
    <HStack w="100%" pb="4">
      <TextField name="secret" placeholder="Secret" header="Header" w="100%" />
      <Button
        size="sm"
        colorScheme="teal"
        px="5"
        onClick={() => handleGenerateSecret(values, setFieldValue)}
      >
        Generate Secret
      </Button>
    </HStack>
  </>
);

const SecretField = ({
  isEditMode,
  editSecret,
  handleGenerateSecret,
  values,
  setFieldValue,
  setEditSecret,
}) => {
  if (!isEditMode) return null;
  return (
    <VStack align="flex-start" style={{ borderBottom: "1px solid #E2E8F0" }}>
      {editSecret ? (
        <EditSecretField
          handleGenerateSecret={handleGenerateSecret}
          values={values}
          setFieldValue={setFieldValue}
        />
      ) : (
        <>
          <WarningAlert />
          <Flex pb="4">
            <Button onClick={() => setEditSecret(true)} colorScheme="teal">
              Change Secret
            </Button>
          </Flex>
        </>
      )}
    </VStack>
  );
};

const SSLAlert = () => (
  <>
    <Alert status="warning">
      <VStack>
        <HStack>
          <AlertIcon />
          <AlertTitle>
            WARNING: Disabling SSL verification has serious implications.
          </AlertTitle>
        </HStack>
        <AlertDescription fontSize="sm">
          SSL verification helps ensure that hook payloads are delivered to your
          URL endpoint securely, keeping your data away from prying eyes.
          Disabling this option is not recommended.
        </AlertDescription>
      </VStack>
    </Alert>
  </>
);

const PageNavigationAccordion = ({
  sourcePages,
  push,
  remove,
  values,
  setFieldValue,
}) => {
  return (
    <Accordion defaultIndex={[0]} allowToggle width="100%">
      <AccordionItem bg="gray.50">
        <AccordionButton
          width="100%"
          _expanded={{ bg: "gray.500", color: "white" }}
        >
          <HStack>
            <Field
              type="checkbox"
              name="pageNavigation"
              checked={values.pageNavigation}
              onChange={() => {
                setFieldValue("pageNavigation", e.target.checked);
              }}
            />
            <Text>Page Navigation</Text>
          </HStack>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <VStack w="100%" align="flex-start">
            <HStack w="100%" justify="space-between">
              <Text as="h4" size="md">
                Trigger Filters
              </Text>
              <IconButton
                colorScheme="green"
                icon={<FaPlusCircle />}
                onClick={() => push("")}
              />
            </HStack>
            {sourcePages.map((sourcePage, index) => (
              <Flex key={index} w="100%">
                <HStack w="100%">
                  <Flex w="40%">
                    <FormikInput
                      name={`sourcePages.${index}`}
                      placeholder="Source page"
                      type="number"
                      size="sm"
                      collapseError
                    />
                  </Flex>
                  <IconButton
                    colorScheme="gray"
                    fontSize="18px"
                    icon={<FaTimes />}
                    size="sm"
                    onClick={() => remove(index)}
                  />
                </HStack>
              </Flex>
            ))}
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

const WebhookForm = ({ isOpen, onClose, onSubmit, webhook }) => {
  const toast = useToast();
  const isEditMode = webhook?.id != null;
  const [editSecret, setEditSecret] = useState(!isEditMode);
  useEffect(() => {
    // Reset edit secret mode when modal is opened in edit mode
    if (isOpen && isEditMode) {
      setEditSecret(false);
    }
  }, [isOpen, isEditMode]);

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
  const handleConfirmNewSecret = async (setFieldValue) => {
    const newSecret = await generateWebhookSecret();
    setFieldValue("secret", newSecret);
    onConfirmationClose();
  };

  const handleCloseModal = () => {
    setEditSecret(false);
    onClose();
  };

  const getInitialValues = (webhook) => ({
    url: webhook?.callbackUrl || "",
    secret: webhook?.hasSecret ? "" : "",
    verifySsl: webhook?.verifySsl || true,
    eventTrigger: webhook?.triggerCriteria?.hasCustomTriggers
      ? "customEvents"
      : "allEvents",
    sourcePages: (
      webhook?.triggerCriteria?.eventTypes?.PAGE_NAVIGATION || []
    ).map((item) => item.sourcePage),
    hasCustomTriggers: webhook?.triggerCriteria?.hasCustomTriggers || false,
    pageNavigation: Boolean(
      webhook?.triggerCriteria?.eventTypes?.PAGE_NAVIGATION?.length >= 0
    ),
  });

  const handleFormikSubmit = (values) => {
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
    setEditSecret(false);
  };
  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditMode ? "Edit Webhook" : "Create a Webhook"}
        </ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={getInitialValues(webhook)}
          onSubmit={handleFormikSubmit}
        >
          {({ values, handleSubmit, setFieldValue }) => {
            return (
              <Form id="myForm" onSubmit={handleSubmit}>
                <ModalBody>
                  <TextField
                    name="url"
                    placeholder="Callback Url"
                    header="Header"
                    size="sm"
                  />
                  <SecretField
                    isEditMode={isEditMode}
                    editSecret={editSecret}
                    handleGenerateSecret={handleGenerateSecret}
                    values={values}
                    setFieldValue={setFieldValue}
                    setEditSecret={setEditSecret}
                  />
                  {!isEditMode && (
                    <CreateModeSecretField
                      values={values}
                      handleGenerateSecret={handleGenerateSecret}
                      setFieldValue={setFieldValue}
                    />
                  )}
                  <VStack
                    py="4"
                    style={{ borderBottom: "1px solid #E2E8F0" }}
                    align="flex-start"
                  >
                    <HStack>
                      <Field type="checkbox" name="verifySsl" />
                      <Text>Verify SSL</Text>
                    </HStack>
                    {!values.verifySsl && <SSLAlert />}
                    <ConfirmationModal
                      isOpen={isConfirmationOpen}
                      onClose={onConfirmationClose}
                      onConfirm={() => handleConfirmNewSecret(setFieldValue)}
                    />
                  </VStack>
                  <VStack
                    align="flex-start"
                    pb="4"
                    style={
                      values.eventTrigger === "customEvents"
                        ? {}
                        : { borderBottom: "1px solid #E2E8F0" }
                    }
                  >
                    <Text pt="4" fontSize="lg" fontWeight="semibold">
                      Which events would you like to trigger this webhook?
                    </Text>
                    <HStack>
                      <Field
                        type="radio"
                        name="eventTrigger"
                        value="allEvents"
                        onChange={() => {
                          setFieldValue("eventTrigger", "allEvents");
                        }}
                      />
                      <Text>All Events</Text>
                      <Field
                        type="radio"
                        name="eventTrigger"
                        value="customEvents"
                        onChange={() => {
                          setFieldValue("eventTrigger", "customEvents");
                          setFieldValue("pageNavigation", true); // Set pageNavigation to true when customEvents is selected
                        }}
                      />
                      <Text>Customize Events</Text>
                    </HStack>
                    {values.eventTrigger === "customEvents" && (
                      <FieldArray name="sourcePages">
                        {({ push, remove }) => (
                          <PageNavigationAccordion
                            sourcePages={values.sourcePages}
                            setFieldValue={setFieldValue}
                            push={push}
                            remove={remove}
                            values={values}
                          />
                        )}
                      </FieldArray>
                    )}
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="red" mr={3} onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button colorScheme="blue" type="submit">
                    Save
                  </Button>
                </ModalFooter>
              </Form>
            );
          }}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default WebhookForm;
