import * as types from "./types";

export const getSurvey = survey => ({
  type: types.GET_SURVEY,
  payload: { survey }
});

export const setSurveyPlaceholder = name => ({
  type: types.SET_SURVEY_PLACEHOLDER,
  payload: { name }
});

export const editSurveyName = name => ({
  type: types.EDIT_SURVEY_NAME,
  payload: { name }
});
