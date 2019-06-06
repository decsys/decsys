import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Typography,
  Button,
  Alert,
  Box,
  Input,
  Checkbox,
  FormCheck,
  FormCheckLabel
} from "@smooth-ui/core-sc";
import {
  List,
  PlusCircle,
  InfoCircle,
  FileImport,
  ExclamationCircle
} from "styled-icons/fa-solid";
import { Container, FlexBox, EmptyState } from "../../../components/ui";
import SurveyList from "../../../components/SurveyList";
import ConfirmModal, { useModal } from "../../../components/ui/ConfirmModal";

const SurveysScreen = ({ surveys, onCreateClick, onImportClick }) => {
  const importModal = useModal();
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
    importModal.toggleModal();
  };

  const handleImportDataCheckboxChange = e => {
    setImportData(e.target.checked);
  };

  return (
    <>
      <Container>
        <FlexBox my={3} alignItems="center" justifyContent="space-between">
          <Typography variant="h1">My Surveys</Typography>
          <FlexBox>
            <Button mr={1} variant="success" onClick={onCreateClick}>
              <PlusCircle size="1em" /> New
            </Button>
            <Button variant="secondary" onClick={importModal.toggleModal}>
              <FileImport size="1em" /> Import
            </Button>
          </FlexBox>
        </FlexBox>

        {!Object.keys(surveys).length ? (
          <Box mt={9}>
            <EmptyState
              splash={<List />}
              message="You don't have any surveys yet."
              callToAction={{
                label: "Create a survey",
                onClick: onCreateClick
              }}
            />
          </Box>
        ) : (
          <>
            <Alert variant="info">
              <InfoCircle size="1em" /> Please don't forget to backup your
              surveys and results to an external source.
            </Alert>

            <SurveyList surveys={surveys} />
          </>
        )}
      </Container>
      <ConfirmModal
        {...importModal}
        header="Import a Survey"
        confirmButton={{
          content: (
            <Typography>
              <FileImport size="1em" /> Import
            </Typography>
          ),
          onClick: handleImportClick
        }}
      >
        <FlexBox flexDirection="column" width={1}>
          <Typography color="info" mb={1}>
            <InfoCircle size="1em" /> Select a previously exported DECSYS Survey
            file to import.
          </Typography>

          <Input type="file" onChange={handleFileSelect} />
          {error && (
            <Typography color="danger">
              <ExclamationCircle size="1em" /> {error}
            </Typography>
          )}

          <FormCheck mt={2}>
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
        </FlexBox>
      </ConfirmModal>
    </>
  );
};

SurveysScreen.propTypes = {
  surveys: PropTypes.shape({}),
  onCreateClick: PropTypes.func.isRequired
};

SurveysScreen.defaultProps = {
  surveys: {}
};

export default SurveysScreen;
