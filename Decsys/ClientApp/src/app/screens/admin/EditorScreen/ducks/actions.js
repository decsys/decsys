import * as types from "./types";

export const getSurvey = survey => ({
  type: types.GET_SURVEY,
  payload: { survey }
});

export const setName = name => ({
  type: types.SET_NAME,
  payload: { name }
});

export const savingName = () => ({
  type: types.SAVING_NAME
});

export const addPage = page => ({
  type: types.ADD_PAGE,
  payload: page
});

export const addPageItem = (pageId, component) => ({
  type: types.ADD_PAGE_ITEM,
  payload: { pageId, component }
});

export const setComponent = (surveyId, pageId, component) => ({
  type: types.SET_COMPONENT,
  payload: {
    surveyId,
    pageId,
    component
  }
});

export const clearComponent = () => ({
  type: types.CLEAR_COMPONENT
});

export const setParam = (pageId, componentId, paramKey, value) => ({
  type: types.SET_COMPONENT_PARAM,
  payload: {
    pageId,
    componentId,
    paramKey,
    value
  }
});

export const setPageRandomize = (pageId, randomize) => ({
  type: types.SET_PAGE_RANDOMIZE,
  payload: {
    pageId,
    randomize
  }
});
