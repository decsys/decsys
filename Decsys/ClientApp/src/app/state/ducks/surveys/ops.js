import axios from "axios";
import * as actions from "./actions";
import { push } from "connected-react-router";

// TODO: AJAX error handling?

/**
 * Create a new Survey with the default name,
 * and take the user to the Survey Editor
 */
export const createSurvey = () => dispatch =>
  // create the survey
  axios.post("/api/surveys").then(
    // redirect to the editor with this survey
    response => dispatch(push(`admin/survey/${response.data}`))
  );

/**
 * Fetch Surveys from the API and update the state with them
 */
export const fetchSurveys = () => dispatch =>
  axios
    .get("/api/surveys")
    .then(response => dispatch(actions.fetchSurveys(response.data)));

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
export const closeInstance = (surveyId, instanceId) => dispatch =>
  axios
    .post(`/api/surveys/${surveyId}/instances/${instanceId}/close`)
    .then(() => {
      dispatch(actions.closeSurvey(surveyId));
    });

/**
 * Launch a new Instance of a Survey
 */
export const launchInstance = id => dispatch =>
  axios
    .post(`/api/surveys/${id}/instances`)
    .then(response => dispatch(actions.launchInstance(id, response.data)));

/**
 * Delete a Survey
 */
export const deleteSurvey = id => dispatch =>
  axios
    .delete(`/api/surveys/${id}`)
    .then(() => dispatch(actions.deleteSurvey(id)));

/**
 * Duplicate a Survey
 * @param {*} id
 */
export const duplicateSurvey = id => dispatch =>
  axios
    .post(`/api/surveys/${id}/duplicate`)
    .then(_ => dispatch(fetchSurveys()));
