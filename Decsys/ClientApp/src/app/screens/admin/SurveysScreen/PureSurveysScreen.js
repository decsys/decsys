import React from "react";
import PropTypes from "prop-types";
import { Typography, Button, Alert, Box } from "@smooth-ui/core-sc";
import { List, PlusCircle, InfoCircle } from "styled-icons/fa-solid";
import { Container, FlexBox, EmptyState } from "../../../components/ui";
import SurveyList from "../../../components/SurveyList";

// TODO: possibly context should be passed in, but don't want a container component

const SurveysScreen = ({ surveys, onCreateClick }) => {
  return (
    <Container>
      <FlexBox my={3} alignItems="center" justifyContent="space-between">
        <Typography variant="h1">My Surveys</Typography>
        <Button variant="secondary" onClick={onCreateClick}>
          <PlusCircle size="1em" /> Create new Survey
        </Button>
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
            <InfoCircle size="1em" /> Please don't forget to backup your surveys
            and results to an external source.
          </Alert>

          <SurveyList surveys={surveys} />
        </>
      )}
    </Container>
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
