import React from "react";
import styled from "styled-components";
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
import { ExclamationTriangle } from "styled-icons/fa-solid";
import FlexBox from "../ui/FlexBox";

const DeleteSurveyModal = ({
  surveyName,
  modalOpened,
  closeModal,
  deleteSurvey
}) => {
  const DangerIcon = styled(ExclamationTriangle)`
    color: ${({ theme }) => theme.danger};
  `;
  return (
    <Modal opened={modalOpened} onClose={closeModal}>
      <ModalDialog>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Typography variant="h5" m={0}>
              Delete survey
            </Typography>
          </ModalHeader>
          <ModalBody>
            <FlexBox alignItems="center" p={1}>
              <DangerIcon size="5em" />
              <FlexBox flexDirection="column" ml={2}>
                <Typography>
                  Are you sure you want to delete{" "}
                  <Typography fontWeight="bold">{surveyName}</Typography>?
                </Typography>
                <Typography as="p" color="danger">
                  This will remove the survey, including all configuration and
                  results data associated with it.
                </Typography>
              </FlexBox>
            </FlexBox>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={deleteSurvey}>
              Delete survey
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalDialog>
    </Modal>
  );
};
export default DeleteSurveyModal;
