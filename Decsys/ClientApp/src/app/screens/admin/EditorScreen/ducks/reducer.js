import * as types from "./types";

export default (state, action) => {
  switch (action.type) {
    case types.GET_SURVEY:
      return {
        ...state,
        survey: action.payload.survey,
        nameUpdateState: {}
      };
    case types.SAVING_NAME:
      return { ...state, nameUpdateState: { saving: true } };

    case types.SET_NAME:
      return {
        ...state,
        survey: { ...state.survey, name: action.payload.name },
        nameUpdateState: { saved: true }
      };

    case types.SET_COMPONENT_PARAM: {
      const { pageId, componentId, paramKey, value } = action.payload;
      const iPage = state.survey.pages.findIndex(x => x.id === pageId);
      const page = state.survey.pages[iPage];
      const iCom = page.components.findIndex(x => x.id === componentId);
      const component = page.components[iCom];
      component.params[paramKey] = value;
      return {
        ...state,
        component: {
          ...state.component,
          component: component
        }
      };
    }
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
    case types.SET_COMPONENT:
      return {
        ...state,
        component: action.payload
      };
    case types.CLEAR_COMPONENT:
      return {
        ...state,
        component: null
      };
    case types.SET_PAGE_RANDOMIZE: {
      const { pageId, randomize } = action.payload;
      const { pages } = state.survey;
      const iPage = pages.findIndex(x => x.id === pageId);
      const page = pages[iPage];
      if (page) {
        page.randomize = randomize;
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
