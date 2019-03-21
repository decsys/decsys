import * as actions from "./actions";
import axios from "axios";

export const getSurvey = id => dispatch =>
  axios
    .get(`/api/surveys/${id}`)
    .then(({ data }) => dispatch(actions.getSurvey(data)));

export const editSurveyName = (id, name) => dispatch =>
  axios
    .put(`/api/surveys/${id}/name`, name)
    .then(() => dispatch(actions.editSurveyName(name)));
