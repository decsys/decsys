import axios from "axios";
import * as actions from "./actions";
import { setSurveyPlaceholder } from "../editor/actions";
import { push } from "connected-react-router";

// TODO: AJAX error handling?

/**
 * Create a new Survey with the default name,
 * and take the user to the Survey Editor
 */
export const createSurvey = () => async dispatch => {
  // create the survey
  const { data } = await axios.post("/api/surveys");
  // redirect to the editor with this survey
  await dispatch(setSurveyPlaceholder("Untitled Survey"));
  dispatch(push(`admin/survey/${data}`));
};

/**
 * Load a Survey in the Editor
 * @param {*} id
 * @param {*} name
 */
export const editSurvey = (id, name) => async dispatch => {
  await dispatch(setSurveyPlaceholder(name));
  dispatch(push(`admin/survey/${id}`));
};

/**
 * Fetch Surveys from the API and update the state with them
 */
export const fetchSurveys = () => async dispatch => {
  const { data } = await axios.get("/api/surveys");
  dispatch(actions.fetchSurveys(data));
};

/**
 * Sort the Survey List by the provided Sort key and direction
 * @param {*} key
 * @param {*} asc
 */
export const sortSurveyList = (key, asc) => dispatch =>
  dispatch(actions.sortSurveyList(key, asc));

/**
 * Filter the Survey List by the provided name filter
 * @param {*} filter
 */
export const filterSurveyList = filter => dispatch =>
  dispatch(actions.filterSurveyList(filter));

/**
 * Close a Survey Instance
 */
export const closeInstance = (surveyId, instanceId) => async dispatch => {
  await axios.post(`/api/surveys/${surveyId}/instances/${instanceId}/close`);
  dispatch(actions.closeSurvey(surveyId));
};

/**
 * Launch a new Instance of a Survey
 */
export const launchInstance = id => async dispatch => {
  const { data } = await axios.post(`/api/surveys/${id}/instances`);
  dispatch(actions.launchInstance(id, data));
};

/**
 * Delete a Survey
 */
export const deleteSurvey = id => async dispatch => {
  await axios.delete(`/api/surveys/${id}`);
  dispatch(actions.deleteSurvey(id));
};

/**
 * Duplicate a Survey
 * @param {*} id
 */
export const duplicateSurvey = id => async dispatch => {
  await axios.post(`/api/surveys/${id}/duplicate`);
  dispatch(fetchSurveys());
};
