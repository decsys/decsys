import * as actions from "./actions";
import { push } from "connected-react-router";
import axios from "axios";

// because we send a string not a JSON object as body data
const appJsonHeaderOptions = {
  headers: {
    "Content-Type": "application/json" // because we send a string not a JSON object as body data
  }
};

/**
 * Get a Survey and add it to the state as the current Editor Survey
 * @param {*} id
 */
export const getSurvey = id => async dispatch => {
  const { data } = await axios.get(`/api/surveys/${id}`);
  dispatch(actions.getSurvey(data));
  dispatch(actions.clearComponent());
};

/**
 * Edit the name of a Survey
 * @param {*} id
 * @param {*} name
 */
export const editName = (id, name) => async dispatch => {
  dispatch(actions.savingName());
  await axios.put(
    `/api/surveys/${id}/name`,
    JSON.stringify(name),
    appJsonHeaderOptions
  );
  dispatch(actions.saveName(name));
};

/**
 * Delete a Survey
 * @param {*} id
 */
export const deleteSurvey = id => async dispatch => {
  await axios.delete(`/api/surveys/${id}`);
  dispatch(push("/admin"));
};

/**
 * Duplicate a Survey, and open the new Survey in the Editor
 * @param {*} id
 */
export const duplicateSurvey = id => async dispatch => {
  const { data } = await axios.post(`/api/surveys/${id}/duplicate`);
  dispatch(push(`/admin/survey/${data}`));
};

/**
 * Add a Page to a Survey
 * @param {*} id
 */
export const addPage = id => async dispatch => {
  const { data } = await axios.post(`/api/surveys/${id}/pages`);
  dispatch(actions.addPage(data));
};

/**
 * Delete a Page from a Survey
 * @param {*} surveyId
 * @param {*} pageId
 */
export const deletePage = (surveyId, pageId) => async dispatch => {
  await axios.delete(`/api/surveys/${surveyId}/pages/${pageId}`);
  dispatch(getSurvey(surveyId));
};

/**
 * Add a built-in Page Item component to a Page
 * @param {*} surveyId
 * @param {*} pageId
 * @param {*} type
 */
export const addPageItem = (surveyId, pageId, type) => async dispatch => {
  const { data } = await axios.post(
    `/api/surveys/${surveyId}/pages/${pageId}/components`,
    JSON.stringify(type),
    appJsonHeaderOptions
  );
  dispatch(actions.addPageItem(pageId, data));
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
  await axios.delete(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${componentId}`
  );
  dispatch(getSurvey(surveyId));
};

/**
 * Duplicate an existing Page
 * @param {*} surveyId
 * @param {*} pageId
 */
export const duplicatePage = (surveyId, pageId) => async dispatch => {
  await axios.post(`/api/surveys/${surveyId}/pages/${pageId}/duplicate`);
  dispatch(getSurvey(surveyId));
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
  await axios.post(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${componentId}/duplicate`
  );
  dispatch(getSurvey(surveyId));
};

/**
 * Move a Page in the Survey Pages order
 * @param {*} surveyId
 * @param {*} pageId
 * @param {*} newOrder
 */
export const reorderPage = (surveyId, pageId, newOrder) => async dispatch => {
  await axios.put(
    `/api/surveys/${surveyId}/pages/${pageId}/order`,
    ++newOrder, // our draggable list is 0-indexed, but order on the server is 1-indexed
    appJsonHeaderOptions
  );
  dispatch(getSurvey(surveyId));
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
  await axios.put(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${componentId}/order`,
    ++newOrder, // our draggable list is 0-indexed, but order on the server is 1-indexed
    appJsonHeaderOptions
  );
  dispatch(getSurvey(surveyId));
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
  // we do quite a few API calls here
  const baseUrl = `/api/surveys/${surveyId}/pages/${pageId}/components`;

  // delete the existing one, if any
  if (componentId) await axios.delete(`${baseUrl}/${componentId}`);

  // only create if we have a type - empty means remove
  if (type) {
    await axios.post(baseUrl, JSON.stringify(type), appJsonHeaderOptions);

    // move the new one to the old one's order, if there was an old one
    if (componentId)
      await axios.put(
        `${baseUrl}/${componentId}/order`,
        order,
        appJsonHeaderOptions
      );
  }
  return dispatch(getSurvey(surveyId));
};

export const setCurrentComponent = (
  surveyId,
  pageId,
  component
) => async dispatch => {
  await dispatch(getSurvey(surveyId));
  dispatch(actions.setComponent(surveyId, pageId, component));
};

export const editParam = (
  surveyId,
  pageId,
  componentId,
  paramKey,
  value
) => async dispatch => {
  await axios.patch(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${componentId}/params`,
    {
      [paramKey]: value
    }
  );
  dispatch(actions.setParam(pageId, componentId, paramKey, value));
};

export const uploadImage = (
  surveyId,
  pageId,
  componentId,
  file,
  extension
) => async dispatch => {
  const formData = new FormData();
  formData.append("file", file);

  await axios.put(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${componentId}/image`,
    formData,
    {
      headers: {
        "content-type": "multipart/form-data"
      }
    }
  );
  dispatch(actions.setParam(pageId, componentId, "extension", extension));
};

export const removeImage = (
  surveyId,
  pageId,
  componentId
) => async dispatch => {
  await axios.delete(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${componentId}/image`
  );
  dispatch(actions.setParam(pageId, componentId, "extension"));
};
