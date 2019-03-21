import * as actions from "./actions";
import axios from "axios";

export const getSurvey = id => dispatch => {
  axios
    .get(`/api/surveys/${id}`)
    .then(({ data }) => dispatch(actions.getSurvey(data)));
};
