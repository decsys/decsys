import { createSelector } from "reselect";

// TODO: this should be sorted once sort state is in
export const getSurveysSortOrder = createSelector(
  [state => state.data.surveys],
  surveys => Object.keys(surveys)
);
