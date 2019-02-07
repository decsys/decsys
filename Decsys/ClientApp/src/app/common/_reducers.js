import * as types from "../admin/surveys/_types";

const dataReducer = (
  state = {
    surveys: {
      1: { id: 1, name: "Jon Survey", runCount: 15, active: false },
      3: { id: 3, name: "Abc Survey", runCount: 10, active: true },
      2: { id: 2, name: "Lol Survey", runCount: 0, active: true }
    }
  },
  action
) => {
  switch (action.type) {
    case types.LAUNCH_SESSION:
      return {
        ...state,
        surveys: {
          ...state.surveys,
          [action.id]: {
            ...state.surveys[action.id],
            active: true,
            runCount:
              state.surveys[action.id].runCount +
              !state.surveys[action.id].active
          }
        }
      };
    case types.CLOSE_SESSION:
      return {
        ...state,
        surveys: {
          ...state.surveys,
          [action.id]: {
            ...state.surveys[action.id],
            active: false
          }
        }
      };
    default:
      return state;
  }
};

export default dataReducer;
