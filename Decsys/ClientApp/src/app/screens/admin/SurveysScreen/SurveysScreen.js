import React, { useReducer } from "react";
import { useNavigation } from "react-navi";
import PureSurveysScreen from "./PureSurveysScreen";
import SurveyCardContext from "../../../components/SurveyCard/Context";
import * as api from "../../../api";

const surveyMapReduce = surveys =>
  surveys.reduce((acc, survey) => {
    acc[survey.id] = survey;
    return acc;
  }, {});

const types = {
  DELETE_SURVEY: "decsys/SurveysScreen/DELETE_SURVEY",
  FETCH_SURVEYS: "decsys/SurveysScreen/FETCH_SURVEYS",
  LAUNCH_SURVEY: "decsys/SurveysScreen/LAUNCH_SURVEY",
  CLOSE_SURVEY: "decsys/SurveysScreen/CLOSE_SURVEY"
};

const actions = {
  deleteSurvey: id => ({ type: types.DELETE_SURVEY, payload: { id } }),
  fetchSurveys: surveys => ({
    type: types.FETCH_SURVEYS,
    payload: { surveys }
  }),
  launchSurvey: (surveyId, instanceId) => ({
    type: types.LAUNCH_SURVEY,
    payload: { surveyId, instanceId }
  }),
  closeSurvey: id => ({
    type: types.CLOSE_SURVEY,
    payload: { id }
  })
};

const surveysReducer = (state = {}, action) => {
  switch (action.type) {
    case types.DELETE_SURVEY:
      const { [action.payload.id]: _, ...keep } = state;
      return keep;
    case types.FETCH_SURVEYS:
      return surveyMapReduce(action.payload.surveys);
    case types.LAUNCH_SURVEY: {
      const { surveyId, instanceId } = action.payload;
      return {
        ...state,
        [surveyId]: {
          ...state[surveyId],
          runCount: state[surveyId].runCount + 1,
          activeInstanceId: instanceId
        }
      };
    }
    case types.CLOSE_SURVEY: {
      const { id } = action.payload;
      return {
        ...state,
        [id]: {
          ...state[id],
          activeInstanceId: null
        }
      };
    }
    default:
      return state;
  }
};

const SurveysScreen = ({ surveys }) => {
  const [state, dispatch] = useReducer(
    surveysReducer,
    surveyMapReduce(surveys)
  );

  const navigation = useNavigation();

  const handleCreateClick = async () => {
    // create the survey
    const { data: id } = await api.createSurvey();
    // redirect to the editor with this survey
    //await dispatch(setSurveyPlaceholder("Untitled Survey")); // TODO: Routing state?
    navigation.navigate(`admin/survey/${id}`);
  };

  const surveyCardActions = {
    handleEditClick: id => navigation.navigate(`admin/survey/${id}`), // TODO: Routing state for placeholder?

    handleDeleteClick: async id => {
      await api.deleteSurvey(id);
      dispatch(actions.deleteSurvey(id));
    },

    handleDuplicateClick: async id => {
      await api.duplicateSurvey(id);
      const { data: surveyList } = await api.listSurveys();
      dispatch(actions.fetchSurveys(surveyList));
    },
    handleLaunchClick: async id => {
      const { data: instanceId } = await api.launchSurvey(id);
      dispatch(actions.launchSurvey(id, instanceId));
    },
    handleCloseClick: async (surveyId, instanceId) => {
      await api.closeSurveyInstance(surveyId, instanceId);
      dispatch(actions.closeSurvey(surveyId));
    }
  };

  return (
    <SurveyCardContext.Provider value={surveyCardActions}>
      <PureSurveysScreen surveys={state} onCreateClick={handleCreateClick} />
    </SurveyCardContext.Provider>
  );
};

export default SurveysScreen;
