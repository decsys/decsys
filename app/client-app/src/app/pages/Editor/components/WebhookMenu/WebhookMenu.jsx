import {
  Alert,
  AlertIcon,
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
} from "@chakra-ui/react";
import { FaEllipsisV, FaPlus, FaPlusCircle, FaTimes } from "react-icons/fa";
import { useRef } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import { TextField } from "../Form/TextField";
import { FormikInput } from "../Form/FormikInput";
import LightHeading from "components/core/LightHeading";

const WebhookMenu = () => {
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

  const handleSubmit = (values) => {
    console.log(
      "Form submitted with: ",
      values.verifySsl,
      values.url,
      values.sourcePages
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
          <Flex align="start" direction="column">
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
          <ModalBody>
            <Formik
              initialValues={{
                url: "",
                page: "",
                verifySsl: true,
                eventTrigger: "allEvents",
                sourcePages: [],
              }}
              onSubmit={(values) => handleSubmit(values)}
            >
              {({ values, handleChange, handleBlur, handleSubmit }) => (
                <Form id="myForm" onSubmit={handleSubmit}>
                  <TextField
                    name="url"
                    placeholder="Callback Url"
                    header="Header"
                    size="sm"
                  />
                  <HStack pb="2" pt="2">
                    <Field type="checkbox" name="verifySsl" />
                    <Text>verifySsl</Text>
                  </HStack>
                  {!values.verifySsl && (
                    <Alert status="warning">
                      <AlertIcon />
                      WARNING: Disabling SSL certificate verification has
                      security implications
                    </Alert>
                  )}
                  <VStack align="flex-start">
                    <LightHeading textAlign="center" size="md" pt="4">
                      Triger Criteria
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
                    <Flex
                      borderColor="gray.300"
                      borderWidth={1}
                      boxShadow="section-h"
                      p="2"
                    >
                      <FieldArray name="sourcePages">
                        {({ push, remove }) => (
                          <Flex spacing={4} w="100%">
                            <VStack w="100%" align="flex-start">
                              <HStack w="100%" justify="space-between">
                                <LightHeading
                                  textAlign="center"
                                  as="h4"
                                  size="md"
                                >
                                  Triger Filters
                                </LightHeading>

                                <IconButton
                                  p={2}
                                  colorScheme="green"
                                  icon={<FaPlusCircle />}
                                  onClick={() => push("")}
                                />
                              </HStack>
                              {values.sourcePages.map((sourcePage, index) => (
                                <Flex key={index} w="100%">
                                  <HStack w="100%" justify="space-between">
                                    <Flex w="34%">
                                      <FormikInput
                                        name={`sourcePages.${index}`}
                                        placeholder="Source page (number)"
                                        type="number"
                                        size="sm"
                                        collapseError
                                      />
                                    </Flex>
                                    <IconButton
                                      p={2}
                                      colorScheme="red"
                                      icon={<FaTimes />}
                                      onClick={() => remove(index)}
                                      ml={2}
                                    />
                                  </HStack>
                                </Flex>
                              ))}
                            </VStack>
                          </Flex>
                        )}
                      </FieldArray>
                    </Flex>
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
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WebhookMenu;
