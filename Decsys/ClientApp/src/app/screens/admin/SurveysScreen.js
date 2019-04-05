import React, { useContext } from "react";
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
import { createSurvey } from "../../state/ducks/surveys";
import UserContext from "../../contexts/user";
import AppBar from "../../components/AppBar";

const PureSurveysScreen = ({ onCreateClick, listLoaded, surveys }) => {
  const { user } = useContext(UserContext);

  if (!user.roles.admin)
    return (
      <>
        <AppBar brand="DECSYS" />
        <Container>
          <FlexBox mt={5}>
            <EmptyState message="401: Not Authorised" />
          </FlexBox>
        </Container>
      </>
    );

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
            <InfoCircle size="1em" /> Please don't forget to backup your surveys
            and results to an external source.
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
};

PureSurveysScreen.propTypes = {
  onCreateClick: PropTypes.func.isRequired,
  listLoaded: PropTypes.bool,
  surveys: PropTypes.shape({})
};

PureSurveysScreen.defaultProps = { surveys: {} };

const SurveysScreen = connect(
  ({ surveys: { list, listLoaded } }) => ({
    surveys: list,
    listLoaded
  }),
  dispatch => ({
    onCreateClick: () => dispatch(createSurvey())
  })
)(PureSurveysScreen);

export { PureSurveysScreen };

export default SurveysScreen;
