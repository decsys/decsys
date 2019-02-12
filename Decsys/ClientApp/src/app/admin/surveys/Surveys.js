import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import { Typography, Button, Alert } from "@smooth-ui/core-sc";
import { InfoCircle, PlusCircle } from "styled-icons/fa-solid";
import FlexBox from "../../common/FlexBox";
import SurveyList from "./SurveyList";
import Container from "../../common/Container";
import { CreateNewSurvey } from "./_actions";

// TODO: Create New Survey wiring
let Surveys = ({ onCreateNewSurveyClick }) => (
  <Container>
    <FlexBox my="3em" alignItems="center" justifyContent="space-between">
      <Typography variant="h1">My Surveys</Typography>

      <Route
        render={({ history, match }) => (
          <Button
            variant="secondary"
            onClick={() => {
              onCreateNewSurveyClick(); // update state (TODO: AJAX)
              // need the new id...
              history.push(`survey/2`);
            }}
          >
            <PlusCircle size="1em" /> Create New Survey
          </Button>
        )}
      />
    </FlexBox>

    <Alert variant="info">
      <InfoCircle size="1em" /> Please don't forget to backup your surveys and
      results to an external source.
    </Alert>

    <SurveyList />
  </Container>
);

Surveys = connect(
  null,
  dispatch => ({
    onCreateNewSurveyClick: () => dispatch(CreateNewSurvey())
  })
)(Surveys);

export default Surveys;
