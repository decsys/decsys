import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  Button,
  Grid,
  Divider
} from "@chakra-ui/core";

const StandardModal = ({
  header,
  children,
  onClose,
  showCloseButton = true,
  cancelButton = true,
  confirmButton,
  ...p
}) => {
  return (
    <Modal preserveScrollBarGap onClose={onClose} {...p}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {header}
          {header && <Divider />}
        </ModalHeader>
        {showCloseButton && <ModalCloseButton />}

        <ModalBody>{children}</ModalBody>

        {(cancelButton || confirmButton) && (
          <>
            <ModalFooter>
              <Grid templateColumns="auto auto" gap={2}>
                {cancelButton && (
                  <Button
                    variantColor={cancelButton.variantColor}
                    onClick={onClose}
                  >
                    {cancelButton.content || "Cancel"}
                  </Button>
                )}
                {confirmButton && (
                  <Button
                    variantColor={confirmButton.variantColor}
                    onClick={confirmButton.onClick}
                  >
                    {confirmButton.content}
                  </Button>
                )}
              </Grid>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default StandardModal;
