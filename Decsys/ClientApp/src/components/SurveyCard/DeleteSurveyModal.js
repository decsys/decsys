import React from "react";
import styled from "styled-components";
import { Typography } from "@smooth-ui/core-sc";
import { ExclamationTriangle } from "styled-icons/fa-solid";
import { FlexBox, ConfirmModal } from "components/core";

const DangerIcon = styled(ExclamationTriangle)`
  color: ${({ theme }) => theme.danger};
`;

const DeleteSurveyModal = ({ surveyName, modalState, deleteSurvey }) => {
  return (
    <ConfirmModal
      {...modalState}
      header="Delete survey"
      confirmButton={{
        content: "Delete survey",
        variant: "danger",
        onClick: deleteSurvey
      }}
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
