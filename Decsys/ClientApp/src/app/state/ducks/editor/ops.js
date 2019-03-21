import * as actions from "./actions";
import axios from "axios";

export const getSurvey = id => dispatch =>
  axios
    .get(`/api/surveys/${id}`)
    .then(({ data }) => dispatch(actions.getSurvey(data)));

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
