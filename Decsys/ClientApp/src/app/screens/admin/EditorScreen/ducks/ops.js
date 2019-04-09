import * as actions from "./actions";
import * as api from "../../../../api";

/**
 * Edit the name of a Survey
 * @param {*} id
 * @param {*} name
 */
export const editName = (id, name) => async dispatch => {
  dispatch(actions.savingName());
  await api.setSurveyName(id, name);
  dispatch(actions.setName(name));
};

/**
 * Delete a Survey
 * @param {*} id
 */
export const deleteSurvey = id => async (_, nav) => {
  await api.deleteSurvey(id);
  nav.navigate("/admin");
};

/**
 * Duplicate a Survey, and open the new Survey in the Editor
 * @param {*} id
 */
export const duplicateSurvey = id => async (dispatch, nav) => {
  const { data: newId } = await api.duplicateSurvey(id);
  dispatch(getSurvey(newId));
  nav.navigate(`/admin/survey/${newId}`);
};

export const editParam = (
  surveyId,
  pageId,
  componentId,
  paramKey,
  value
) => async dispatch => {
  await api.setComponentParam(surveyId, pageId, componentId, paramKey, value);
  dispatch(actions.setParam(pageId, componentId, paramKey, value));
};

export const uploadImage = (
  surveyId,
  pageId,
  componentId,
  file,
  extension
) => async dispatch => {
  await api.uploadComponentImage(surveyId, pageId, componentId, file);

  dispatch(actions.setParam(pageId, componentId, "extension", extension));
};

export const removeImage = (
  surveyId,
  pageId,
  componentId
) => async dispatch => {
  await api.deleteComponentImage(surveyId, pageId, componentId);
  dispatch(actions.setParam(pageId, componentId, "extension"));
};

/**
 * Get a Survey and add it to the state as the current Editor Survey
 * @param {*} id
 */
export const getSurvey = id => async dispatch => {
  const { data: survey } = await api.getSurvey(id);
  dispatch(actions.getSurvey(survey));
  dispatch(actions.clearComponent());
};

/**
 * Add a Page to a Survey
 * @param {*} id
 */
export const addPage = id => async dispatch => {
  const { data: page } = await api.createSurveyPage(id);
  dispatch(actions.addPage(page));
};

/**
 * Delete a Page from a Survey
 * @param {*} surveyId
 * @param {*} pageId
 */
export const deletePage = (surveyId, pageId) => async dispatch => {
  await api.deleteSurveyPage(surveyId, pageId);
  dispatch(getSurvey(surveyId)); // TODO: Delete from local state
};

/**
 * Add a built-in Page Item component to a Page
 * @param {*} surveyId
 * @param {*} pageId
 * @param {*} type
 */
export const addPageItem = (surveyId, pageId, type) => async dispatch => {
  const { data: item } = await api.addSurveyPageItem(surveyId, pageId, type);
  dispatch(actions.addPageItem(pageId, item));
};

/**
 * Delete a built-in Page Item component from a Page
 * @param {*} surveyId
 * @param {*} pageId
 * @param {*} componentId
 */
export const deletePageItem = (
  surveyId,
  pageId,
  componentId
) => async dispatch => {
  await api.deleteSurveyPageItem(surveyId, pageId, componentId);
  dispatch(getSurvey(surveyId)); // TODO: update local state
};

/**
 * Duplicate an existing Page
 * @param {*} surveyId
 * @param {*} pageId
 */
export const duplicatePage = (surveyId, pageId) => async dispatch => {
  await api.duplicateSurveyPage(surveyId, pageId);
  dispatch(getSurvey(surveyId)); // TODO: update local state
};

/**
 * Duplicate an existing built-in Page Item component
 * @param {*} surveyId
 * @param {*} pageId
 * @param {*} componentId
 */
export const duplicatePageItem = (
  surveyId,
  pageId,
  componentId
) => async dispatch => {
  await api.duplicateSurveyPageItem(surveyId, pageId, componentId);
  dispatch(getSurvey(surveyId)); // TODO: update local state
};

/**
 * Move a Page in the Survey Pages order
 * @param {*} surveyId
 * @param {*} pageId
 * @param {*} newOrder
 */
export const reorderPage = (surveyId, pageId, newOrder) => async dispatch => {
  await api.setSurveyPageOrder(
    surveyId,
    pageId,
    ++newOrder // our draggable list is 0-indexed, but order on the server is 1-indexed
  );
  dispatch(getSurvey(surveyId)); // TODO: update local state
};

/**
 * Move a Component in the Page Components order
 * @param {*} surveyId
 * @param {*} pageId
 * @param {*} componentId
 * @param {*} newOrder
 */
export const reorderComponent = (
  surveyId,
  pageId,
  componentId,
  newOrder
) => async dispatch => {
  await api.setSurveyPageItemOrder(
    surveyId,
    pageId,
    componentId,
    ++newOrder // our draggable list is 0-indexed, but order on the server is 1-indexed
  );
  dispatch(getSurvey(surveyId)); // TODO: update local state
};

/**
 * Change the Page Component associated with a Page
 * @param {*} surveyId
 * @param {*} pageId
 * @param {*} type
 * @param {*} componentId
 * @param {*} order
 */
export const changePageComponent = (
  surveyId,
  pageId,
  type,
  componentId,
  order
) => async dispatch => {
  // delete the existing one, if any
  if (componentId)
    await api.deleteSurveyPageItem(surveyId, pageId, componentId);

  // if we have a type, go on to create the new type
  if (type) {
    const { data: newComponent } = await api.addSurveyPageItem(
      surveyId,
      pageId,
      type
    );

    // move the new one to the old one's order, if there was an old one
    if (componentId)
      await api.setSurveyPageItemOrder(
        surveyId,
        pageId,
        newComponent.id,
        order
      );
  }
  dispatch(getSurvey(surveyId));
};

export const setCurrentComponent = (
  surveyId,
  pageId,
  component
) => async dispatch => {
  //dispatch(getSurvey(surveyId));
  dispatch(actions.setComponent(surveyId, pageId, component));
};

export const setPageRandomize = (
  surveyId,
  pageId,
  randomize
) => async dispatch => {
  await api.setPageRandomize(surveyId, pageId, randomize);
  dispatch(actions.setPageRandomize(pageId, randomize));
};
