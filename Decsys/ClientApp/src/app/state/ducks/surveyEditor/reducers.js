import * as types from "./types";

const surveyEditorReducer = (state = { survey: {} }, action) => {
  switch (action.type) {
    case types.SET_SURVEY_PLACEHOLDER:
      return {
        ...state,
        survey: { name: action.payload.name },
        surveyLoaded: false
      };
    case types.GET_SURVEY:
      return {
        ...state,
        survey: action.payload.survey,
        surveyLoaded: true,
        nameSaving: false,
        nameSaved: false
      };

    default:
      return state;
  }
};

export default surveyEditorReducer;
