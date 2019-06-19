import React from "react";
import PropTypes from "prop-types";
import { Typography, Button, Alert, Box } from "@smooth-ui/core-sc";
import { List, PlusCircle, InfoCircle } from "styled-icons/fa-solid";
import { Container, FlexBox, EmptyState } from "../../../components/ui";
import SurveyList from "../../../components/SurveyList";
import { useModal } from "../../../components/ui/ConfirmModal";
import AboutLink from "../../../components/AboutLink";
import AppBar from "../../../components/AppBar";
import AddSurveyModal from "./AddSurveyModal";

const SurveysScreen = ({
  surveys,
  onCreateClick,
  onImportClick,
  onLoadInternalClick
}) => {
  const addSurveyModal = useModal();

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
              onClick={addSurveyModal.toggleModal}
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
                onClick: addSurveyModal.toggleModal
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

      <AddSurveyModal
        modalState={addSurveyModal}
        onCreateClick={onCreateClick}
        onImportClick={onImportClick}
        onLoadInternalClick={onLoadInternalClick}
      />
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
