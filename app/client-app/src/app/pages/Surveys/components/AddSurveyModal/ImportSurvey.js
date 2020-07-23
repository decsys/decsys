import React, { useState } from "react";
import {
  Button,
  Flex,
  Collapse,
  Input,
  Stack,
  Checkbox,
} from "@chakra-ui/core";
import useToggle from "hooks/useToggle";
import { FaFileImport } from "react-icons/fa";
import { useAddSurveyActions } from "../../contexts/AddSurveyActions";
import Alert from "components/core/Alert";

const ImportSurvey = () => {
  const [isExpanded, toggleExpanded] = useToggle();
  return (
    <>
      <Button mb={1} onClick={toggleExpanded}>
        Import an existing Survey...
      </Button>
      <Collapse isOpen={isExpanded}>
        <ImportSurveyForm />
      </Collapse>
    </>
  );
};

const isZip = (filename) => filename.split(".").pop().toLowerCase() === "zip";

const ImportSurveyForm = ({ modalState }) => {
  const { importFile } = useAddSurveyActions();

  const [state, setState] = useState({
    importData: false,
  });

  const handleFileSelect = (e) => {
    e.persist();
    const error = !isZip(e.target.value)
      ? "Invalid file extension. Expected .zip"
      : null;
    setState({ ...state, error, file: e.target.files[0] });
  };

  const handleDataImportChange = (e) => {
    setState({ ...state, importData: e.target.checked });
  };

  const handleImportClick = () => {
    if (!state.file || state.error) return;
    importFile(state.file, state.importData);
    modalState.onClose();
  };

  return (
    <Stack spacing={1} p={2}>
      <Alert hasIcon>
        Select a previously exported DECSYS Survey file to import.
      </Alert>

      <Input type="file" onChange={handleFileSelect} />
      {state.error && (
        <Alert hasIcon status="error">
          {state.error}
        </Alert>
      )}

      <Checkbox onChange={handleDataImportChange} isChecked={state.importData}>
        Also import any Results Data
      </Checkbox>

      <Flex justifyContent="flex-end">
        <Button
          colorScheme="blue"
          leftIcon={<FaFileImport />}
          onClick={handleImportClick}
        >
          Import
        </Button>
      </Flex>
    </Stack>
  );
};

export default ImportSurvey;
