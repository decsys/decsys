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
  Divider,
  Flex,
} from "@chakra-ui/react";

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
      <ModalOverlay>
        <ModalContent>
          <ModalHeader pb={2}>{header}</ModalHeader>
          {header && <Divider m={0} />}
          {showCloseButton && <ModalCloseButton />}

          <ModalBody>
            <Flex width="100%" align="center" p={2}>
              {children}
            </Flex>
          </ModalBody>

          {(cancelButton || confirmButton) && (
            <>
              <Divider m={0} />
              <ModalFooter p={2}>
                <Grid templateColumns="auto auto" gap={2}>
                  {cancelButton && (
                    <Button
                      colorScheme={cancelButton.colorScheme}
                      onClick={cancelButton.onClick || onClose}
                    >
                      {cancelButton.content || "Cancel"}
                    </Button>
                  )}
                  {confirmButton && <Button {...confirmButton} />}
                </Grid>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default StandardModal;
