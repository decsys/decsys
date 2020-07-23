import * as types from "./types";

export const deleteSurvey = id => ({
  type: types.DELETE_SURVEY,
  payload: { id }
});
export const fetchSurveys = surveys => ({
  type: types.FETCH_SURVEYS,
  payload: { surveys }
});
export const launchSurvey = (surveyId, instanceId) => ({
  type: types.LAUNCH_SURVEY,
  payload: { surveyId, instanceId }
});
export const closeSurvey = id => ({
  type: types.CLOSE_SURVEY,
  payload: { id }
});
