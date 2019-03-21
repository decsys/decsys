import * as actions from "./actions";
import { deleteSurvey as surveysDeleteSurvey } from "../surveys/ops";
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
  dispatch(surveysDeleteSurvey(id));
  dispatch(push("/admin/surveys"));
};
