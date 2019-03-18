import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Container,
  FlexBox,
  EmptyState,
  LoadingIndicator
} from "../../components/ui/";
import { Typography, Button, Alert, Box } from "@smooth-ui/core-sc";
import { List, PlusCircle, InfoCircle } from "styled-icons/fa-solid";
import SurveyList from "../../components/SurveyList";
import { createSurvey, fetchSurveys } from "../../state/ducks/surveys";

class PureSurveysScreen extends Component {
  static propTypes = {
    onFetchSurveys: PropTypes.func.isRequired,
    onCreateClick: PropTypes.func.isRequired,
    listLoaded: PropTypes.bool,
    surveys: PropTypes.shape({})
  };

  static defaultProps = {
    surveys: {}
  };

  componentDidUpdate(old) {
    this.props.onFetchSurveys(); // TODO: maybe check on react-router props to do this conditionally? e.g. match/history etc
  }

  componentDidMount() {
    this.props.onFetchSurveys(); // TODO: may not need this if the above works?
  }

  render() {
    const { onCreateClick, surveys, listLoaded } = this.props;
    return (
      <Container>
        <FlexBox my={3} alignItems="center" justifyContent="space-between">
          <Typography variant="h1">My Surveys</Typography>

          <Button variant="secondary" onClick={onCreateClick}>
            <PlusCircle size="1em" /> Create new Survey
          </Button>
        </FlexBox>

        {!Object.keys(surveys).length ? (
          listLoaded ? (
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
            <LoadingIndicator />
          )
        ) : (
          <>
            <Alert variant="info">
              <InfoCircle size="1em" /> Please don't forget to backup your
              surveys and results to an external source.
            </Alert>

            <SurveyList
              surveys={surveys}
              allowLaunch={
                Object.keys(surveys).filter(
                  id => surveys[id].activeInstanceId != null
                ).length === 0
              }
            />
          </>
        )}
      </Container>
    );
  }
}

const SurveysScreen = connect(
  ({ surveys: { list, listLoaded } }) => ({
    surveys: list,
    listLoaded
  }),
  dispatch => ({
    onFetchSurveys: () => dispatch(fetchSurveys()),
    onCreateClick: () => dispatch(createSurvey())
  })
)(PureSurveysScreen);

export { PureSurveysScreen };

export default SurveysScreen;
