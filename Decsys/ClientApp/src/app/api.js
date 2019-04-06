import Axios from "axios";

// for when we send a string not a JSON object as body data
const appJsonHeaderOptions = {
  headers: {
    "Content-Type": "application/json"
  }
};

export const putSurveyName = (id, name) =>
  Axios.put(
    `/api/surveys/${id}/name`,
    JSON.stringify(name),
    appJsonHeaderOptions
  );

export const createSurvey = () => Axios.post("/api/surveys");

export const deleteSurvey = id => Axios.delete(`/api/surveys/${id}`);

export const duplicateSurvey = id => Axios.post(`/api/surveys/${id}/duplicate`);

export const listSurveys = () => Axios.get("/api/surveys");

export const launchSurvey = id => Axios.post(`/api/surveys/${id}/instances`);

export const closeSurveyInstance = (surveyId, instanceId) =>
  Axios.post(`/api/surveys/${surveyId}/instances/${instanceId}/close`);
