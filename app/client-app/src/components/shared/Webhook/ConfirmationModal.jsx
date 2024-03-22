import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Confirmation</ModalHeader>
      <ModalBody>
        If you generate a new secret, your current secret will be replaced. Are
        you sure?
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="red" onClick={onClose}>
          Cancel
        </Button>
        <Button
          colorScheme="green"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          ml={3}
        >
          Confirm
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default ConfirmationModal;
