import * as types from "./types";
import { getSortedLookup, getFilteredLookup } from "./utils";

const fetchSurveys = (state, { surveys }) => {
  const { sortState, filter } = state;
  const list = surveys.reduce((acc, survey) => {
    acc[survey.id] = survey;
    return acc;
  }, {});
  const sorted = getSortedLookup(list, sortState.key, sortState[sortState.key]);
  return {
    ...state,
    listLoaded: true,
    list,
    sorted,
    filtered: getFilteredLookup(sorted, filter)
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
    case types.FILTER_SURVEY_LIST:
      return {
        ...state,
        filtered: getFilteredLookup(state.sorted, action.payload.filter),
        filter: action.payload.filter
      };
    case types.CLOSE_SURVEY:
      const { id } = action.payload;
      return {
        ...state,
        list: {
          ...state.list,
          [id]: {
            ...state.list[id],
            activeInstanceId: null
          }
        }
      };
    case types.LAUNCH_INSTANCE:
      const { surveyId, instanceId } = action.payload;
      return {
        ...state,
        list: {
          ...state.list,
          [surveyId]: {
            ...state.list[surveyId],
            runCount: ++state.list[surveyId].runCount,
            activeInstanceId: instanceId
          }
        }
      };
    case types.DELETE_SURVEY:
      // Bleh, use spread to isolate nested keys we want to remove
      const { list, ...rest } = state;
      const { [action.payload.id]: _, ...keep } = list;
      return {
        ...rest,
        list: keep
      };
    default:
      return state;
  }
};

export default surveyListReducer;
