import Axios from "axios";

// for when we send a string not a JSON object as body data
const appJsonHeaderOptions = {
  headers: {
    "Content-Type": "application/json"
  }
};

export const setSurveyName = (id, name) =>
  Axios.put(
    `/api/surveys/${id}/name`,
    JSON.stringify(name),
    appJsonHeaderOptions
  );

export const listSurveys = () => Axios.get("/api/surveys");

export const getSurvey = id => Axios.get(`/api/surveys/${id}`);

export const createSurvey = () => Axios.post("/api/surveys");

export const deleteSurvey = id => Axios.delete(`/api/surveys/${id}`);

export const duplicateSurvey = id => Axios.post(`/api/surveys/${id}/duplicate`);

export const launchSurvey = id => Axios.post(`/api/surveys/${id}/instances`);

export const closeSurveyInstance = (surveyId, instanceId) =>
  Axios.post(`/api/surveys/${surveyId}/instances/${instanceId}/close`);

export const setComponentParam = (
  surveyId,
  pageId,
  componentId,
  paramKey,
  value
) =>
  Axios.patch(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${componentId}/params`,
    {
      [paramKey]: value
    }
  );

export const uploadComponentImage = (surveyId, pageId, componentId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  Axios.put(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${componentId}/image`,
    formData,
    {
      headers: {
        "content-type": "multipart/form-data"
      }
    }
  );
};

export const deleteComponentImage = (surveyId, pageId, componentId) =>
  Axios.delete(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${componentId}/image`
  );

export const createSurveyPage = id => Axios.post(`/api/surveys/${id}/pages`);

export const deleteSurveyPage = (surveyId, pageId) =>
  Axios.delete(`/api/surveys/${surveyId}/pages/${pageId}`);

export const addSurveyPageItem = (surveyId, pageId, type) =>
  Axios.post(
    `/api/surveys/${surveyId}/pages/${pageId}/components`,
    JSON.stringify(type),
    appJsonHeaderOptions
  );

export const deleteSurveyPageItem = (surveyId, pageId, componentId) =>
  Axios.delete(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${componentId}`
  );

export const duplicateSurveyPage = (surveyId, pageId) =>
  Axios.post(`/api/surveys/${surveyId}/pages/${pageId}/duplicate`);

export const duplicateSurveyPageItem = (surveyId, pageId, componentId) =>
  Axios.post(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${componentId}/duplicate`
  );

export const setSurveyPageOrder = (surveyId, pageId, newOrder) =>
  Axios.put(
    `/api/surveys/${surveyId}/pages/${pageId}/order`,
    newOrder,
    appJsonHeaderOptions
  );

export const setSurveyPageItemOrder = (
  surveyId,
  pageId,
  componentId,
  newOrder
) =>
  Axios.put(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${componentId}/order`,
    newOrder,
    appJsonHeaderOptions
  );

export const getSurveyInstance = (surveyId, instanceId) =>
  Axios.get(`/api/surveys/${surveyId}/instances/${instanceId}`);
