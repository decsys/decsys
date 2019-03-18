import * as types from "./types";

export const fetchSurveys = surveys => ({
  type: types.FETCH_SURVEYS,
  payload: { surveys }
});

export const launchSession = id => ({
  type: types.LAUNCH_SESSION,
  payload: { id }
});

export const closeSession = id => ({
  type: types.CLOSE_SESSION,
  payload: { id }
});

export const sortSurveyList = (surveys, key, asc) => ({
  type: types.SORT_SURVEY_LIST,
  payload: {
    surveys,
    key,
    asc
  }
});

export const filterSurveyList = filter => ({
  type: types.FILTER_SURVEY_LIST,
  payload: { filter }
});

export const duplicateSurvey = id => ({
  type: types.DUPLICATE_SURVEY,
  payload: { id }
});

export const deleteSurvey = id => ({
  type: types.DELETE_SURVEY,
  payload: { id }
});

export const createSurvey = survey => ({
  type: types.CREATE_SURVEY,
  payload: { survey }
});
