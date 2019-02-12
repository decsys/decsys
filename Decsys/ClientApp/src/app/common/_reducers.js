import * as types from "../admin/surveys/_types";

const dataReducer = (
  state = {
    surveys: {
      1: { id: 1, name: "Jon Survey", runCount: 15, active: false },
      3: { id: 3, name: "Abc Survey", runCount: 10, active: true },
      2: {
        id: 2,
        name: "Lol Survey with a  really long name i guess?",
        runCount: 0,
        active: false
      }
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
    case types.DELETE_SURVEY:
      // Bleh, use spread to isolate nested keys we want to remove
      const { surveys, ...rest } = state;
      const { [action.id]: _, ...keep } = surveys;
      return {
        ...rest,
        surveys: keep
      };

    case types.DUPLICATE_SURVEY:
      // TODO: for realz (like most things) this will follow an AJAX Op
      // this one differs in that all the dupe logic can go
      // as we'll get the new survey back from the API
      const dupe = {
        ...state.surveys[action.id],
        id: Math.max(...Object.keys(state.surveys).map(id => ++id), 1),
        active: false,
        runCount: 0,
        name: `${state.surveys[action.id].name} (Copy)`
      };
      return {
        ...state,
        surveys: {
          ...state.surveys,
          [dupe.id]: dupe
        }
      };
    case types.CREATE_SURVEY:
      return {
        ...state,
        surveys: {
          ...state.surveys,
          [action.survey.id]: action.survey
        }
      };
    default:
      return state;
  }
};

export default dataReducer;
