import { createSelector } from "reselect";

const getSurveys = state => state.data.surveys;
const getSortState = state => state.admin.surveys.sort;

/**
 * Gets the appropriate sort function for a given survey property
 */
const getPropertySorter = (key, asc) => {
  const defaultSorter = ({ [key]: a }, { [key]: b }) => (asc ? a - b : b - a);

  const sorters = {
    name: ({ [key]: a }, { [key]: b }) =>
      asc ? a.localeCompare(b) : b.localeCompare(a)
  };

  return sorters[key] || defaultSorter;
};

export const getSurveysSortOrder = createSelector(
  [getSurveys, getSortState],
  (surveys, sort) =>
    Object.keys(surveys)
      .map(id => surveys[id])
      .sort(getPropertySorter(sort.key, sort[sort.key]))
      .map(survey => survey.id)
);
