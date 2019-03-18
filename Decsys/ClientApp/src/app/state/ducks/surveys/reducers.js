import * as types from "./types";
import { getSortedLookup, getFilteredLookup } from "./utils";

const fetchSurveys = (state, { surveys }) => {
  return {
    ...state,
    listLoaded: true,
    list: surveys.reduce((acc, survey) => {
      acc[survey.id] = survey;
      return acc;
    }, {})
  };
};

const surveyListReducer = (
  state = { sortState: { key: "name" }, filter: "" },
  action
) => {
  switch (action.type) {
    case types.FETCH_SURVEYS:
      return fetchSurveys(state, action.payload);
    case types.SORT_SURVEY_LIST:
      const { surveys, key, asc } = action.payload;
      const sortState = {
        ...state.sortState,
        key,
        [action.key]: asc
      };
      const sorted = getSortedLookup(surveys, key, asc);

      return {
        ...state,
        sortState,
        sorted,
        filtered: getFilteredLookup(sorted, state.filter)
      };
    default:
      return state;
  }
};

export default surveyListReducer;
