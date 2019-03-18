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
  state = { list: {}, sortState: { key: "name" }, filter: "" },
  action
) => {
  switch (action.type) {
    case types.FETCH_SURVEYS:
      return fetchSurveys(state, action.payload);
    case types.SORT_SURVEY_LIST:
      const { key, asc } = action.payload;
      const sortState = {
        ...state.sortState,
        key,
        [key]: asc
      };
      const sorted = getSortedLookup(state.list, key, asc);

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
