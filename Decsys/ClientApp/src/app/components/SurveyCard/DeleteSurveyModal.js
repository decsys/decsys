import React from "react";
import styled from "styled-components";
import { Typography } from "@smooth-ui/core-sc";
import { ExclamationTriangle } from "styled-icons/fa-solid";
import { FlexBox, ConfirmModal } from "../ui";

const DeleteSurveyModal = ({ surveyName, modalState, deleteSurvey }) => {
  const DangerIcon = styled(ExclamationTriangle)`
    color: ${({ theme }) => theme.danger};
  `;
  return (
    <ConfirmModal
      {...modalState}
      header="Delete survey"
      confirmButtonLabel="Delete survey"
      confirmButtonVariant="danger"
      onConfirmClick={deleteSurvey}
    >
      <DangerIcon size="5em" />
      <FlexBox flexDirection="column" ml={2}>
        <Typography>
          Are you sure you want to delete{" "}
          <Typography fontWeight="bold">{surveyName}</Typography>?
        </Typography>
        <Typography as="p" color="danger">
          This will remove the survey, including all configuration and results
          data associated with it.
        </Typography>
      </FlexBox>
    </ConfirmModal>
  );
};
export default DeleteSurveyModal;
