import * as types from "./types";

export const surveyMapReduce = surveys =>
  surveys.reduce((acc, survey) => {
    acc[survey.id] = survey;
    return acc;
  }, {});

export default (state = {}, action) => {
  switch (action.type) {
    case types.DELETE_SURVEY:
      const { [action.payload.id]: _, ...keep } = state;
      return keep;
    case types.FETCH_SURVEYS:
      return surveyMapReduce(action.payload.surveys);
    case types.LAUNCH_SURVEY: {
      const { surveyId, instanceId } = action.payload;
      return {
        ...state,
        [surveyId]: {
          ...state[surveyId],
          runCount: state[surveyId].runCount + 1,
          activeInstanceId: instanceId
        }
      };
    }
    case types.CLOSE_SURVEY: {
      const { id } = action.payload;
      return {
        ...state,
        [id]: {
          ...state[id],
          activeInstanceId: null
        }
      };
    }
    default:
      return state;
  }
};
