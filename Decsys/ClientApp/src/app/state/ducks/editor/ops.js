import * as actions from "./actions";
import { push } from "connected-react-router";
import axios from "axios";

/**
 * Get a Survey and add it to the state as the current Editor Survey
 * @param {*} id
 */
export const getSurvey = id => dispatch =>
  axios
    .get(`/api/surveys/${id}`)
    .then(({ data }) => dispatch(actions.getSurvey(data)));

/**
 * Edit the name of a Survey
 * @param {*} id
 * @param {*} name
 */
export const editName = (id, name) => dispatch => {
  dispatch(actions.savingName());
  axios
    .put(`/api/surveys/${id}/name`, JSON.stringify(name), {
      headers: {
        "Content-Type": "application/json" // because we send a string not a JSON object as body data
      }
    })
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
      {
        headers: {
          "Content-Type": "application/json" // because we send a string not a JSON object as body data
        }
      }
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
