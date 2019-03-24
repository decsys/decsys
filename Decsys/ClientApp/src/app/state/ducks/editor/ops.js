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
export const getSurvey = id => dispatch =>
  axios.get(`/api/surveys/${id}`).then(({ data }) => {
    dispatch(actions.getSurvey(data));
    dispatch(actions.clearComponent());
  });

/**
 * Edit the name of a Survey
 * @param {*} id
 * @param {*} name
 */
export const editName = (id, name) => dispatch => {
  dispatch(actions.savingName());
  axios
    .put(`/api/surveys/${id}/name`, JSON.stringify(name), appJsonHeaderOptions)
    .then(() => dispatch(actions.saveName(name)));
};

/**
 * Delete a Survey
 * @param {*} id
 */
export const deleteSurvey = id => dispatch => {
  axios.delete(`/api/surveys/${id}`).then(() => dispatch(push("/admin")));
};

/**
 * Duplicate a Survey, and open the new Survey in the Editor
 * @param {*} id
 */
export const duplicateSurvey = id => dispatch => {
  axios
    .post(`/api/surveys/${id}/duplicate`)
    .then(({ data }) => dispatch(push(`/admin/survey/${data}`)));
};

/**
 * Add a Page to a Survey
 * @param {*} id
 */
export const addPage = id => dispatch => {
  axios
    .post(`/api/surveys/${id}/pages`)
    .then(({ data }) => dispatch(actions.addPage(data)));
};

/**
 * Delete a Page from a Survey
 * @param {*} surveyId
 * @param {*} pageId
 */
export const deletePage = (surveyId, pageId) => dispatch => {
  axios
    .delete(`/api/surveys/${surveyId}/pages/${pageId}`)
    .then(() => dispatch(getSurvey(surveyId)));
};

/**
 * Add a built-in Page Item component to a Page
 * @param {*} surveyId
 * @param {*} pageId
 * @param {*} type
 */
export const addPageItem = (surveyId, pageId, type) => dispatch => {
  axios
    .post(
      `/api/surveys/${surveyId}/pages/${pageId}/components`,
      JSON.stringify(type),
      appJsonHeaderOptions
    )
    .then(({ data }) => dispatch(actions.addPageItem(pageId, data)));
};

/**
 * Delete a built-in Page Item component from a Page
 * @param {*} surveyId
 * @param {*} pageId
 * @param {*} componentId
 */
export const deletePageItem = (surveyId, pageId, componentId) => dispatch => {
  axios
    .delete(
      `/api/surveys/${surveyId}/pages/${pageId}/components/${componentId}`
    )
    .then(() => dispatch(getSurvey(surveyId)));
};

/**
 * Duplicate an existing Page
 * @param {*} surveyId
 * @param {*} pageId
 */
export const duplicatePage = (surveyId, pageId) => dispatch => {
  axios
    .post(`/api/surveys/${surveyId}/pages/${pageId}/duplicate`)
    .then(() => dispatch(getSurvey(surveyId)));
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
) => dispatch => {
  axios
    .post(
      `/api/surveys/${surveyId}/pages/${pageId}/components/${componentId}/duplicate`
    )
    .then(() => dispatch(getSurvey(surveyId)));
};

/**
 * Move a Page in the Survey Pages order
 * @param {*} surveyId
 * @param {*} pageId
 * @param {*} newOrder
 */
export const reorderPage = (surveyId, pageId, newOrder) => dispatch => {
  axios
    .put(
      `/api/surveys/${surveyId}/pages/${pageId}/order`,
      ++newOrder, // our draggable list is 0-indexed, but order on the server is 1-indexed
      appJsonHeaderOptions
    )
    .then(() => dispatch(getSurvey(surveyId)));
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
) => dispatch => {
  axios
    .put(
      `/api/surveys/${surveyId}/pages/${pageId}/components/${componentId}/order`,
      ++newOrder, // our draggable list is 0-indexed, but order on the server is 1-indexed
      appJsonHeaderOptions
    )
    .then(() => dispatch(getSurvey(surveyId)));
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
) => dispatch => {
  // we do quite a few API calls here
  const baseUrl = `/api/surveys/${surveyId}/pages/${pageId}/components`;

  // ugh, conditionals means declaring stuff out of order
  const get = () => dispatch(getSurvey(surveyId));
  const create = () => {
    // actually only create if we have a type - empty means remove
    if (!type) return get();
    axios.post(baseUrl, JSON.stringify(type), appJsonHeaderOptions).then(() => {
      // move the new one to the old one's order, if there was an old one
      if (componentId)
        axios
          .put(`${baseUrl}/${componentId}/order`, order, appJsonHeaderOptions)
          .then(get());
      else get();
    });
  };

  // delete the existing one, if any
  if (componentId)
    axios.delete(`${baseUrl}/${componentId}`).then(() => create());
  else create();
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
) => dispatch => {
  axios
    .patch(
      `/api/surveys/${surveyId}/pages/${pageId}/components/${componentId}/params`,
      {
        [paramKey]: value
      }
    )
    .then(() =>
      dispatch(actions.setParam(pageId, componentId, paramKey, value))
    );
};

export const uploadImage = (
  surveyId,
  pageId,
  componentId,
  file,
  extension
) => dispatch => {
  const formData = new FormData();
  formData.append("file", file);

  axios
    .put(
      `/api/surveys/${surveyId}/pages/${pageId}/components/${componentId}/image`,
      formData,
      {
        headers: {
          "content-type": "multipart/form-data"
        }
      }
    )
    .then(() => {
      dispatch(actions.setParam(pageId, componentId, "extension", extension));
    });
};

export const removeImage = (surveyId, pageId, componentId) => dispatch => {
  axios
    .delete(
      `/api/surveys/${surveyId}/pages/${pageId}/components/${componentId}/image`
    )
    .then(() => {
      dispatch(actions.setParam(pageId, componentId, "extension"));
    });
};
