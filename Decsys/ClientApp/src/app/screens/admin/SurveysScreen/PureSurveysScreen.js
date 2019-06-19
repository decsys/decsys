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
  FormCheckLabel,
  Toggler
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
import AboutLink from "../../../components/AboutLink";
import AppBar from "../../../components/AppBar";

const SurveysScreen = ({
  surveys,
  onCreateClick,
  onImportClick,
  onLoadInternalClick
}) => {
  const newSurveyModal = useModal();
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
    newSurveyModal.toggleModal();
  };

  const handleImportDataCheckboxChange = e => {
    setImportData(e.target.checked);
  };

  const handleLoadInternalClick = type => {
    onLoadInternalClick(type);
    newSurveyModal.toggleModal();
  };
  const handleLoadDemoClick = () => handleLoadInternalClick("demo");
  const handleLoadSampleClick = () => handleLoadInternalClick("sample");

  return (
    <>
      <AppBar brand="DECSYS">
        <AboutLink />
      </AppBar>
      <Container>
        <FlexBox my={3} alignItems="center" justifyContent="space-between">
          <Typography variant="h1">My Surveys</Typography>
          <FlexBox>
            <Button
              mr={1}
              variant="success"
              onClick={newSurveyModal.toggleModal}
            >
              <PlusCircle size="1em" /> Add a Survey
            </Button>
          </FlexBox>
        </FlexBox>

        {!Object.keys(surveys).length ? (
          <Box mt={9}>
            <EmptyState
              splash={<List />}
              message="You don't have any surveys yet."
              callToAction={{
                label: "Add a Survey",
                onClick: newSurveyModal.toggleModal
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
        {...newSurveyModal}
        header="New Survey"
        cancelButton={false}
      >
        <FlexBox flexDirection="column" width={1}>
          <Button variant="success" mb={1} onClick={onCreateClick}>
            Create a blank Survey
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
          >
            Load a demonstration Survey
          </Button>

          <Button
            variant="light"
            border={1}
            borderColor="secondary"
            onClick={handleLoadSampleClick}
          >
            Load a sample Survey
          </Button>
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
