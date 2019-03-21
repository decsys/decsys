import * as types from "./types";

export const getSurvey = survey => ({
  type: types.GET_SURVEY,
  payload: { survey }
});

export const setSurveyPlaceholder = name => ({
  type: types.SET_SURVEY_PLACEHOLDER,
  payload: { name }
});
