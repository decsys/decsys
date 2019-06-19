import React, { useState } from "react";
import {
  Typography,
  Button,
  Input,
  Checkbox,
  FormCheck,
  FormCheckLabel,
  Toggler,
  Tooltip
} from "@smooth-ui/core-sc";
import {
  InfoCircle,
  FileImport,
  ExclamationCircle
} from "styled-icons/fa-solid";
import { FlexBox } from "../../../components/ui";
import ConfirmModal from "../../../components/ui/ConfirmModal";

const AddSurveyModal = ({
  modalState,
  onCreateClick,
  onImportClick,
  onLoadInternalClick
}) => {
  const [importFile, setImportFile] = useState();
  const [importData, setImportData] = useState(false);
  const [error, setError] = useState();

  const idTimestamp = new Date().getTime();

  const handleFileSelect = e => {
    setImportFile();
    setError();
    e.persist();
    if (
      e.target.value
        .split(".")
        .pop()
        .toLowerCase() !== "zip"
    )
      setError("Invalid file extension. Expected .zip");
    setImportFile(e.target.files[0]);
  };

  const handleImportClick = () => {
    if (!importFile || error) return;
    onImportClick(importFile, importData);
    modalState.toggleModal();
  };

  const handleImportDataCheckboxChange = e => {
    setImportData(e.target.checked);
  };

  const handleLoadInternalClick = type => {
    onLoadInternalClick(type);
    modalState.toggleModal();
  };
  const handleLoadDemoClick = () => handleLoadInternalClick("demo");
  const handleLoadSampleClick = () => handleLoadInternalClick("sample");

  return (
    <ConfirmModal {...modalState} header="Add a Survey" cancelButton={false}>
      <FlexBox flexDirection="column" width={1}>
        <Button variant="success" mb={1} onClick={onCreateClick}>
          Start with a blank Survey
        </Button>

        <Toggler>
          {([toggled, onToggle]) => (
            <>
              <Button
                variant="secondary"
                mb={1}
                onClick={() => onToggle(!toggled)}
              >
                Import an existing Survey...
              </Button>

              {toggled && (
                <FlexBox flexDirection="column" width={1} p={1}>
                  <Typography color="info" mb={1}>
                    <InfoCircle size="1em" /> Select a previously exported
                    DECSYS Survey file to import.
                  </Typography>

                  <Input type="file" onChange={handleFileSelect} />
                  {error && (
                    <Typography color="danger">
                      <ExclamationCircle size="1em" /> {error}
                    </Typography>
                  )}

                  <FormCheck my={2}>
                    <Checkbox
                      control
                      size="lg"
                      id={`import-data-${idTimestamp}`}
                      checked={importData}
                      onChange={handleImportDataCheckboxChange}
                    />
                    <FormCheckLabel htmlFor={`import-data-${idTimestamp}`}>
                      Also import any Results Data
                    </FormCheckLabel>
                  </FormCheck>
                  <FlexBox justifyContent="flex-end">
                    <Button mb={1} onClick={handleImportClick}>
                      <FileImport size="1em" /> Import
                    </Button>
                  </FlexBox>
                </FlexBox>
              )}
            </>
          )}
        </Toggler>

        <Button
          variant="light"
          border={1}
          borderColor="secondary"
          mb={1}
          onClick={handleLoadDemoClick}
          title="This Survey demonstrates the features of the DECSYS Survey Platform."
        >
          Load the Demo Survey
          <Tooltip placement="left" width="150px" zIndex={9999}>
            <InfoCircle size="1em" /> This Survey demonstrates the features of
            the DECSYS Survey Platform.
          </Tooltip>
        </Button>

        <Button
          variant="light"
          border={1}
          borderColor="secondary"
          onClick={handleLoadSampleClick}
        >
          Load the Sample Research Survey
          <Tooltip placement="left" width="150px" zIndex={9999}>
            <InfoCircle size="1em" /> This Survey shows the Platform using the
            Ellipse Rating Scale in a Research context.
          </Tooltip>
        </Button>
      </FlexBox>
    </ConfirmModal>
  );
};

export default AddSurveyModal;
