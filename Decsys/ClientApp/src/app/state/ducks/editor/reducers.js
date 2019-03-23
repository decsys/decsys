import * as types from "./types";

const surveyEditorReducer = (
  state = { survey: {}, updateStates: { name: {} } },
  action
) => {
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
        updateStates: {
          ...state.updateStates,
          name: {}
        }
      };
    case types.SAVING_NAME:
      return {
        ...state,
        updateStates: {
          ...state.updateStates,
          name: { saving: true }
        }
      };
    case types.EDIT_NAME:
      return {
        ...state,
        survey: {
          ...state.survey,
          name: action.payload.name
        },
        updateStates: {
          ...state.updateStates,
          name: { saving: false, saved: true }
        }
      };

    case types.ADD_PAGE: {
      const pages = state.survey.pages;
      pages.push(action.payload);
      return {
        ...state,
        survey: {
          ...state.survey,
          pages
        }
      };
    }
    case types.ADD_PAGE_ITEM: {
      const { pageId, component } = action.payload;
      const { pages } = state.survey;
      const iPage = pages.findIndex(x => x.id === pageId);
      const page = pages[iPage];
      if (page) {
        page.components = [...page.components, component];
      }
      pages[iPage] = page;

      return {
        ...state,
        survey: {
          ...state.survey,
          pages
        }
      };
    }
    default:
      return state;
  }
};

export default surveyEditorReducer;
