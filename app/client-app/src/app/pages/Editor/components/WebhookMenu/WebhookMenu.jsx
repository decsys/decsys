import {
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
} from "@chakra-ui/react";
import { FaEllipsisV, FaPlus } from "react-icons/fa";
import { useRef } from "react";
import { Formik, Form, Field } from "formik";
import { TextField } from "../Form/TextField";
import { FormikInput } from "../Form/FormikInput";

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
      values.page
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
              New Webhook
            </Button>
          </Flex>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeWebhooksModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal finalFocusRef={finalRef} isOpen={isFormOpen} onClose={onFormClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Webhook</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ url: "", page: "", verifySsl: false }}
              onSubmit={(values) => handleSubmit(values)}
            >
              {(props) => (
                <Form id="myForm">
                  <TextField
                    name="url"
                    placeholder="Callback Url"
                    header="Header"
                    size="sm"
                  />
                  <FormikInput
                    name="page"
                    placeholder="Source Page (number)"
                    type="number"
                    size="sm"
                    collapseError
                  />
                  <HStack>
                    <Text>verifySsl</Text>
                    <Field type="checkbox" name="verifySsl" />
                  </HStack>
                  <ModalFooter>
                    <Button colorScheme="red" mr={3} onClick={onFormClose}>
                      Cancel
                    </Button>
                    <Button colorScheme="blue" mr={3} type="submit">
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
