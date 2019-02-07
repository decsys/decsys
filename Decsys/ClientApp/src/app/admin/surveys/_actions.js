import * as types from "./_types";

export const LaunchSession = id => ({
  type: types.LAUNCH_SESSION,
  id
});

export const CloseSession = id => ({
  type: types.CLOSE_SESSION,
  id
});

export const SortSurveyList = (surveys, key, asc) => ({
  type: types.SORT_SURVEY_LIST,
  surveys,
  key,
  asc
});
