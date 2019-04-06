import React, { useState } from "react";
import PropTypes from "prop-types";
import Axios from "axios";
import { Typography, Button, Alert, Box } from "@smooth-ui/core-sc";
import { List, PlusCircle, InfoCircle } from "styled-icons/fa-solid";
import { useNavigation } from "react-navi";
import { Container, FlexBox, EmptyState } from "../../components/ui";
import SurveyList from "../../components/SurveyList";
import SurveyCardContext from "../../components/SurveyCard/Context";

const surveyMapReduce = surveys =>
  surveys.reduce((acc, survey) => {
    acc[survey.id] = survey;
    return acc;
  }, {});

// TODO: possibly context should be passed in, but don't want a container component

const SurveysScreen = ({ surveys: surveyList }) => {
  const [surveys, setSurveys] = useState(surveyMapReduce(surveyList));

  const navigation = useNavigation();

  const handleCreateClick = async () => {
    // create the survey
    const { data: id } = await Axios.post("/api/surveys");
    // redirect to the editor with this survey
    //await dispatch(setSurveyPlaceholder("Untitled Survey")); // TODO: Routing state?
    navigation.navigate(`admin/survey/${id}`);
  };

  const context = {
    handleEditClick: id => navigation.navigate(`admin/survey/${id}`), // TODO: Routing state for placeholder?
    handleDeleteClick: async id => {
      await Axios.delete(`/api/surveys/${id}`);
      const { [id]: _, ...keep } = surveys;
      setSurveys(keep);
    },
    handleDuplicateClick: async id => {
      await Axios.post(`/api/surveys/${id}/duplicate`);
      const { data: surveyList } = await Axios.get("/api/surveys");
      setSurveys(surveyMapReduce(surveyList));
    },
    handleLaunchClick: async id => {
      const { data: instanceId } = await Axios.post(
        `/api/surveys/${id}/instances`
      );
      setSurveys({
        ...surveys,
        [id]: {
          ...surveys[id],
          runCount: surveys[id].runCount + 1,
          activeInstanceId: instanceId
        }
      });
    },
    handleCloseClick: async (surveyId, instanceId) => {
      await Axios.post(
        `/api/surveys/${surveyId}/instances/${instanceId}/close`
      );
      setSurveys({
        ...surveys,
        [surveyId]: {
          ...surveys[surveyId],
          activeInstanceId: null
        }
      });
    }
  };

  return (
    <Container>
      <FlexBox my={3} alignItems="center" justifyContent="space-between">
        <Typography variant="h1">My Surveys</Typography>
        <Button variant="secondary" onClick={handleCreateClick}>
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
              onClick: handleCreateClick
            }}
          />
        </Box>
      ) : (
        <>
          <Alert variant="info">
            <InfoCircle size="1em" /> Please don't forget to backup your surveys
            and results to an external source.
          </Alert>

          <SurveyCardContext.Provider value={context}>
            <SurveyList surveys={surveys} />
          </SurveyCardContext.Provider>
        </>
      )}
    </Container>
  );
};

SurveysScreen.propTypes = {
  surveys: PropTypes.shape({})
};

SurveysScreen.defaultProps = {
  surveys: []
};

export default SurveysScreen;
