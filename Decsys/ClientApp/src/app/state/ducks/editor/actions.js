import * as types from "./types";

export const getSurvey = survey => ({
  type: types.GET_SURVEY,
  payload: { survey }
});

export const setSurveyPlaceholder = name => ({
  type: types.SET_SURVEY_PLACEHOLDER,
  payload: { name }
});

export const saveName = name => ({
  type: types.EDIT_NAME,
  payload: { name }
});

export const savingName = () => ({
  type: types.SAVING_NAME
});

export const addPage = page => ({
  type: types.ADD_PAGE,
  payload: { ...page }
});

export const addPageItem = (pageId, component) => ({
  type: types.ADD_PAGE_ITEM,
  payload: { pageId, component }
});
