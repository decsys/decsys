import React from "react";
import { Button } from "@smooth-ui/core-sc";
import { surveyExport } from "../../services/export";
import { FlexBox, ConfirmModal } from "../ui";

const ExportModal = ({ modalState, survey }) => {
  const handleExportStructure = () => surveyExport(survey, "structure");
  const handleExportFull = () => surveyExport(survey, "full");

  return (
    <ConfirmModal
      {...modalState}
      header={`Export ${survey.name}`}
      cancelButton={false}
    >
      <FlexBox flexDirection="column" p={1} width={1}>
        <Button onClick={handleExportStructure} mb={1}>
          Export Survey Structure Only
        </Button>
        <Button onClick={handleExportFull}>
          Export Survey Structure and Full Response Data
        </Button>
      </FlexBox>
    </ConfirmModal>
  );
};

export default ExportModal;
