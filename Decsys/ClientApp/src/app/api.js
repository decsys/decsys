import Axios from "axios";

// for when we send a string not a JSON object as body data
const appJsonHeaderOptions = {
  headers: {
    "Content-Type": "application/json"
  }
};

export const getCancelToken = () => Axios.CancelToken.source();

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

const uploadFile = (url, file, method = "post") => {
  const formData = new FormData();
  formData.append("file", file);
  Axios[method](url, formData, {
    headers: {
      "content-type": "multipart/form-data"
    }
  });
};

export const uploadComponentImage = (surveyId, pageId, componentId, file) =>
  uploadFile(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${componentId}/image`,
    file,
    "put"
  );

export const deleteComponentImage = (surveyId, pageId, componentId) =>
  Axios.delete(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${componentId}/image`
  );

export const uploadSurveyImport = (file, importData = false) =>
  uploadFile(`api/surveys/import?importData=${importData}`, file);

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

export const listSurveyInstances = surveyId =>
  Axios.get(`/api/surveys/${surveyId}/instances`);

export const getAnonymousParticipantId = () =>
  Axios.post("/api/identity/anonymous");

export const logParticipantEvent = (
  instanceId,
  participantId,
  source,
  type,
  payload
) =>
  Axios.post(
    `/api/log/${instanceId}/${participantId}/${source}/${type}`,
    payload,
    appJsonHeaderOptions
  );

export const setPageRandomize = (surveyId, pageId, randomize) =>
  Axios.put(
    `/api/surveys/${surveyId}/pages/${pageId}/randomize`,
    randomize,
    appJsonHeaderOptions
  );

export const getLastLogEntry = (instanceId, participantId, source, type) =>
  Axios.get(`/api/log/${instanceId}/${participantId}/${source}/${type}`);

export const getLastLogEntryByTypeOnly = (instanceId, participantId, type) =>
  Axios.get(`/api/log/${instanceId}/${participantId}/${type}`);

export const getInstanceResultsSummary = (surveyId, instanceId) =>
  Axios.get(`/api/surveys/${surveyId}/instances/${instanceId}/results`);

export const getInstanceResultsFull = (surveyId, instanceId) =>
  Axios.get(
    `/api/surveys/${surveyId}/instances/${instanceId}/results?type=full`
  );

export const setSurveyConfig = (surveyId, config) =>
  Axios.put(`/api/surveys/${surveyId}/config`, config);

export const getSurveyConfig = async (surveyId, { token: cancelToken }) => {
  try {
    return await Axios.get(`/api/surveys/${surveyId}/config`, { cancelToken });
  } catch (e) {
    if (Axios.isCancel(e)) {
      // cancellations are fine
      const cancelError = new Error("Request Cancelled");
      // enable calling code to check this without importing Axios
      cancelError.isCancellation = true;
      throw cancelError;
    }

    throw e;
  }
};

export const getSurveyExport = (surveyId, type) =>
  Axios.get(`/api/surveys/${surveyId}/export?type=${type}`);
