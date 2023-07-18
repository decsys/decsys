import { Button, Flex, Icon, useDisclosure } from "@chakra-ui/react";
import LightHeading from "components/core/LightHeading";
import { FaEllipsisV, FaPlus } from "react-icons/fa";
import { usePageListContext } from "../../contexts/PageList";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

const Header = () => {
  const { addPage } = usePageListContext();
  const { isOpen, onOpen, onClose: onCloseModel } = useDisclosure();
  const finalRef = useRef(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddWebhook = () => {
    setShowForm(true);
  };

  const onClose = () => {
    onCloseModel();
    setShowForm(false);
  };

  return (
    <Flex p={4} justify="space-between" align="center">
      <LightHeading size="lg">Pages</LightHeading>
      <HStack>
        <Button colorScheme="green" onClick={addPage} leftIcon={<FaPlus />}>
          Add Page
        </Button>
        <Menu>
          <MenuButton
            border="thin solid"
            borderColor="gray.500"
            as={IconButton}
            icon={<FaEllipsisV />}
            boxSize={"40px"}
          />
          <MenuList>
            <MenuItem onClick={onOpen}> Manage Webhooks ...</MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Webhooks</ModalHeader>
          <ModalCloseButton />
          {showForm ? (
            <Text>Webbhook Form </Text> //Form for adding new webhook goes here
          ) : (
            <>
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
            </>
          )}
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Header;
