import axios from "axios";
import {
  withHeaders,
  contentType_AppJson,
  authorization_BearerToken,
} from "./helpers";

export const createSurveyPage = async (id) =>
  await axios.post(
    `/api/surveys/${id}/pages`,
    null,
    withHeaders(await authorization_BearerToken())
  );

export const setSurveyPageOrder = async (surveyId, pageId, newOrder) =>
  await axios.put(
    `/api/surveys/${surveyId}/pages/${pageId}/order`,
    newOrder,
    withHeaders(contentType_AppJson, await authorization_BearerToken())
  );

export const setSurveyPageName = async (surveyId, pageId, newName) =>
  await axios.put(
    `/api/surveys/${surveyId}/pages/${pageId}/name`,
    JSON.stringify(newName),
    withHeaders(contentType_AppJson, await authorization_BearerToken())
  );

export const deleteSurveyPage = async (surveyId, pageId) =>
  await axios.delete(
    `/api/surveys/${surveyId}/pages/${pageId}`,
    withHeaders(await authorization_BearerToken())
  );

export const duplicateSurveyPage = async (surveyId, pageId) =>
  await axios.post(
    `/api/surveys/${surveyId}/pages/${pageId}/duplicate`,
    null,
    withHeaders(await authorization_BearerToken())
  );

export const setPageRandomize = async (surveyId, pageId, randomize) =>
  await axios.put(
    `/api/surveys/${surveyId}/pages/${pageId}/randomize`,
    randomize,
    withHeaders(contentType_AppJson, await authorization_BearerToken())
  );

export const addSurveyPageItem = async (surveyId, pageId, type) =>
  await axios.post(
    `/api/surveys/${surveyId}/pages/${pageId}/components`,
    JSON.stringify(type),
    withHeaders(contentType_AppJson, await authorization_BearerToken())
  );
