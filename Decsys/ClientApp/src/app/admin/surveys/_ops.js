import { SortSurveyList, DuplicateSurvey } from "./_actions";

export const sortSurveyList = (key, asc) => (dispatch, getState) =>
  dispatch(SortSurveyList(getState().data.surveys, key, asc));

export const duplicateSurvey = id => (dispatch, getState) => {
  // TODO: AJAX
  dispatch(DuplicateSurvey(id));
  const { key, ...asc } = getState().admin.surveys.sort;
  return sortSurveyList(key, asc[key]);
};
