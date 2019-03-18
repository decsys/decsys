import * as types from "../admin/surveys/_types";

const dataReducer = (state = {}, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
};

export default dataReducer;
