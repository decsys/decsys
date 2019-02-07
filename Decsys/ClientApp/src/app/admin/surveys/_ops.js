import { SortSurveyList } from "./_actions";

export const sortSurveyList = (key, asc) => (dispatch, getState) =>
  dispatch(SortSurveyList(getState().data.surveys, key, asc));
