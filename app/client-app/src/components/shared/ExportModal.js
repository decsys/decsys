import React from "react";
import { surveyExport } from "services/export";
import { StandardModal } from "components/core";
import { Flex, Button } from "@chakra-ui/core";

const ExportModal = ({ modalState, id, name }) => {
  const handleExportStructure = () => surveyExport(id, name, "structure");
  const handleExportFull = () => surveyExport(id, name, "full");

  return (
    <StandardModal
      {...modalState}
      header={`Export ${name}`}
      cancelButton={false}
    >
      <Flex direction="column" p={1} width="100%">
        <Button onClick={handleExportStructure} mb={1}>
          Export Survey Structure Only
        </Button>
        <Button onClick={handleExportFull}>
          Export Survey Structure and Full Response Data
        </Button>
      </Flex>
    </StandardModal>
  );
};

export default ExportModal;
