import React, { useState } from "react";
import {
  Modal,
  ModalDialog,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  Typography,
  ModalBody,
  ModalFooter,
  Button
} from "@smooth-ui/core-sc";
import FlexBox from "../ui/FlexBox";

export const useModal = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const toggleModal = () => setModalOpened(!modalOpened);
  return { modalOpened, toggleModal };
};

const ConfirmModal = ({
  header,
  children,
  modalOpened,
  toggleModal,
  onConfirmClick,
  confirmButtonLabel,
  confirmButtonVariant
}) => {
  return (
    <Modal opened={modalOpened} onClose={toggleModal}>
      <ModalDialog>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Typography variant="h5" m={0}>
              {header}
            </Typography>
          </ModalHeader>
          <ModalBody>
            <FlexBox alignItems="center" p={1}>
              {children}
            </FlexBox>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={toggleModal}>
              Cancel
            </Button>
            <Button variant={confirmButtonVariant} onClick={onConfirmClick}>
              {confirmButtonLabel}
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalDialog>
    </Modal>
  );
};
export default ConfirmModal;
