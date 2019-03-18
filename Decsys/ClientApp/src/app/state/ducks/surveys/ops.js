import axios from "axios";
import * as actions from "./actions";
import { push } from "connected-react-router";

/**
 * Create a new Survey with the default name,
 * and take the user to the Survey Editor
 */
export const createSurvey = () => dispatch =>
  // create the survey
  axios.post("/api/surveys").then(
    // redirect to the editor with this survey
    response => dispatch(push(`survey/${response.data}`))
  );

/**
 * Fetch Surveys from the API and update the state with them
 */
export const fetchSurveys = () => dispatch =>
  axios
    .get("/api/surveys")
    .then(response => dispatch(actions.fetchSurveys(response.data)));

export const sortSurveyList = (surveys, key, asc) => dispatch =>
  dispatch(actions.sortSurveyList(surveys, key, asc));
