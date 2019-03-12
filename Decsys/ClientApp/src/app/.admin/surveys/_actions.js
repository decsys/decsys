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

export const FilterSurveyList = filter => ({
  type: types.FILTER_SURVEY_LIST,
  filter
});

export const DuplicateSurvey = id => ({
  type: types.DUPLICATE_SURVEY,
  id
});

export const DeleteSurvey = id => ({
  type: types.DELETE_SURVEY,
  id
});

export const CreateNewSurvey = survey => ({
  type: types.CREATE_SURVEY,
  survey
});
