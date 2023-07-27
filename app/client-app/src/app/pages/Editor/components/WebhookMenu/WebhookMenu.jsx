import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  HStack,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";
import { FaEllipsisV, FaPlus, FaPlusCircle, FaTimes } from "react-icons/fa";
import { useRef } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField } from "../Form/TextField";
import { FormikInput } from "../Form/FormikInput";
import LightHeading from "components/core/LightHeading";
import { useFetchSurvey } from "app/contexts/FetchSurvey";
import { createWebhook } from "api/webhooks";

const WebhookMenu = () => {
  const { id: surveyId } = useFetchSurvey();

  const {
    isOpen: isWebhooksModalOpen,
    onOpen: openWebhooksModal,
    onClose: closeWebhooksModal,
  } = useDisclosure();

  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();
  const finalRef = useRef(null);

  const handleAddWebhook = () => {
    onFormOpen();
  };

  const handleSubmit = async (values) => {
    const {
      verifySsl,
      url,
      sourcePages,
      hasCustomTriggers,
      secret,
      pageNavigation,
    } = values;
    await createWebhook(
      surveyId,
      url,
      secret,
      verifySsl,
      sourcePages,
      hasCustomTriggers,
      pageNavigation
    );
  };

  return (
    <>
      <Menu>
        <MenuButton
          border="thin solid"
          borderColor="gray.500"
          as={IconButton}
          icon={<FaEllipsisV />}
          boxSize={"40px"}
        />
        <MenuList>
          <MenuItem onClick={openWebhooksModal}>Manage Webhooks ...</MenuItem>
        </MenuList>
      </Menu>

      <Modal
        finalFocusRef={finalRef}
        isOpen={isWebhooksModalOpen}
        onClose={closeWebhooksModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Webhooks</ModalHeader>
          <ModalCloseButton />
          <ModalBody>sample text - existing Webhooks</ModalBody>
          <Flex align="start" direction="column" pl={6}>
            <Button
              colorScheme="green"
              size="sm"
              leftIcon={<FaPlus />}
              onClick={handleAddWebhook}
            >
              Create a Webhook
            </Button>
          </Flex>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeWebhooksModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        finalFocusRef={finalRef}
        isOpen={isFormOpen}
        size="xl"
        onClose={onFormClose}
      >
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
              handleSubmit(values);
            }}
          >
            {({ values, handleSubmit }) => (
              <Form id="myForm" onSubmit={handleSubmit}>
                <Box p={2}>
                  <VStack>
                    <TextField
                      name="url"
                      placeholder="Callback Url"
                      header="Header"
                      size="sm"
                    />
                    <TextField
                      name="secret"
                      placeholder="Secret"
                      header="Header"
                      size="sm"
                    />
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
                    <Button colorScheme="red" mr={3} onClick={onFormClose}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="blue"
                      type="submit"
                      onClick={onFormClose}
                    >
                      Save
                    </Button>
                  </ModalFooter>
                </Box>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WebhookMenu;
