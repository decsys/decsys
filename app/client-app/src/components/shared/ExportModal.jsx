import { surveyExport } from "services/export";
import { StandardModal, BusyPage } from "components/core";
import { Flex, Button } from "@chakra-ui/react";
import { useState } from "react";

const ExportModal = ({ modalState, id, name }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingFullStructure, setIsExportingFullStructure] =
    useState(false);

  const handleExportStructure = async () => {
    setIsExporting(true);
    await surveyExport(id, name, "structure");
    setIsExporting(false);
  };

  const handleExportFull = async () => {
    setIsExportingFullStructure(true);
    await surveyExport(id, name, "full");
    setIsExportingFullStructure(false);
  };

  return (
    <StandardModal
      {...modalState}
      header={`Export ${name}`}
      cancelButton={false}
    >
      <Flex direction="column" p={1} width="100%">
        <Button onClick={handleExportStructure} mb={1}>
          {isExporting ? (
            <BusyPage verb="Exporting" />
          ) : (
            "Export Survey Structure Only"
          )}
        </Button>
        <Button onClick={handleExportFull}>
          {isExportingFullStructure ? (
            <BusyPage verb="Exporting" />
          ) : (
            "Export Survey Structure and Full Response Data"
          )}
        </Button>
      </Flex>
    </StandardModal>
  );
};

export default ExportModal;
