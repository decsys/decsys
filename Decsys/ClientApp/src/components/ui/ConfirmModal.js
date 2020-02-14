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
  showCloseButton = true,
  cancelButton = true,
  confirmButton,
  ...p
}) => {
  return (
    <Modal opened={modalOpened} onClose={toggleModal}>
      <ModalDialog {...p}>
        <ModalContent>
          {showCloseButton && <ModalCloseButton />}
          <ModalHeader>
            <Typography variant="h5" m={0}>
              {header}
            </Typography>
          </ModalHeader>
          <ModalBody>
            <FlexBox width={1} alignItems="center" p={1}>
              {children}
            </FlexBox>
          </ModalBody>
          {(cancelButton || confirmButton) && (
            <ModalFooter>
              {cancelButton && (
                <Button
                  variant={cancelButton.variant || "secondary"}
                  onClick={toggleModal}
                >
                  {cancelButton.content || "Cancel"}
                </Button>
              )}
              {confirmButton && (
                <Button
                  variant={confirmButton.variant}
                  onClick={confirmButton.onClick}
                >
                  {confirmButton.content}
                </Button>
              )}
            </ModalFooter>
          )}
        </ModalContent>
      </ModalDialog>
    </Modal>
  );
};
export default ConfirmModal;
