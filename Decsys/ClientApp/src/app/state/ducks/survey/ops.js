import axios from "axios";
import * as actions from "./actions";

/**
 * Get a Survey and add it to the state as the current Editor Survey
 * @param {*} id
 */
export const getSurvey = id => dispatch =>
  axios.get(`/api/surveys/${id}`).then(({ data }) => {
    dispatch(actions.getSurvey(data));
  });
