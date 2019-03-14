import { SortSurveyList, DuplicateSurvey, CreateNewSurvey } from "./_actions";
import { push } from "connected-react-router";

export const sortSurveyList = (key, asc) => (dispatch, getState) =>
  dispatch(SortSurveyList(getState().data.surveys, key, asc));

export const duplicateSurvey = id => (dispatch, getState) => {
  // TODO: AJAX
  dispatch(DuplicateSurvey(id)); // TODO this will become create once the server does duplication
  const { key, ...asc } = getState().admin.surveys.sort;
  sortSurveyList(key, asc[key])(dispatch, getState);
};

export const createNewSurvey = () => (dispatch, getState) => {
  // TODO: AJAX
  const id = Math.max(
    ...Object.keys(getState().data.surveys).map(id => ++id),
    1
  );
  dispatch(
    CreateNewSurvey({
      id,
      name: "Unnamed Survey",
      runCount: 0
    })
  );
  const { key, ...asc } = getState().admin.surveys.sort;
  sortSurveyList(key, asc[key])(dispatch, getState);
  dispatch(push(`survey/${id}`));
};
