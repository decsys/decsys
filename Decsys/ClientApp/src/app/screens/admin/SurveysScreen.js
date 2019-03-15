import React from "react";
import PropTypes from "prop-types";
import { Container, FlexBox, EmptyState } from "../../components/ui/";
import { Typography, Button, Alert, Box } from "@smooth-ui/core-sc";
import { List, PlusCircle, InfoCircle } from "styled-icons/fa-solid";

const SurveysScreen = ({ onCreateClick, surveys }) => (
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
          callToAction={{ label: "Create a survey", onClick: onCreateClick }}
        />
      </Box>
    ) : (
      <Alert variant="info">
        <InfoCircle size="1em" /> Please don't forget to backup your surveys and
        results to an external source.
      </Alert>
    )}
  </Container>
);

SurveysScreen.propTypes = {
  onCreateClick: PropTypes.func.isRequired,
  surveys: PropTypes.shape({})
};

SurveysScreen.defaultProps = {
  surveys: {}
};

export default SurveysScreen;
