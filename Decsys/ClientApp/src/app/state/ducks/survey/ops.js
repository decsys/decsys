import axios from "axios";
import * as actions from "./actions";

/**
 * TODO: Get the current active Survey Instance and add to state as the current Participant Survey
 * @param {*} id
 */
export const getSurveyInstance = () => dispatch =>
  axios.get(`/api/surveys`).then(({ data }) => {
    dispatch(actions.getSurvey(data));
  });
