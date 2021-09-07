import axios from "axios";
import {
  uploadFile,
  defaultFetcher,
  withHeaders,
  authorization_BearerToken,
  contentType_AppJson,
} from "./helpers";
import useSWR from "swr";
import { toDictionary } from "services/data-structures";

export const useSurveysList = () =>
  useSWR(
    "/api/surveys",
    async (url) => {
      const surveys = await defaultFetcher(true)(url);
      return toDictionary(surveys);
    },
    { suspense: true }
  );

/**
 * Fetch a single Survey from the API using SWR
 * @param {*} id The ID of the Survey to fetch
 * @returns `{data, mutate}`
 */
export const useSurvey = (id) =>
  useSWR(`/api/surveys/${id}`, defaultFetcher(true), { suspense: true });

export const createSurvey = async (name, type, settings, isStudy) =>
  await axios.post(
    "/api/surveys",
    { name, type, settings, isStudy },
    withHeaders(await authorization_BearerToken())
  );

export const uploadSurveyImport = async (
  file,
  importData = false,
  name,
  type,
  settings
) =>
  await uploadFile(
    `/api/surveys/import?importData=${importData}`,
    file,
    "post",
    {
      name,
      type,
      settings,
    }
  );

export const loadInternalSurvey = async (internalKey, name, type, settings) =>
  await axios.post(
    `/api/surveys/internal/${internalKey}`,
    { name, type, settings },
    withHeaders(await authorization_BearerToken())
  );

export const deleteSurvey = async (id) =>
  await axios.delete(
    `/api/surveys/${id}`,
    withHeaders(await authorization_BearerToken())
  );

export const duplicateSurvey = async (id, name, type, settings) =>
  await axios.post(
    `/api/surveys/${id}/duplicate`,
    { name, type, settings },
    withHeaders(await authorization_BearerToken())
  );

export const launchSurvey = async (id) =>
  await axios.post(
    `/api/surveys/${id}/instances`,
    null,
    withHeaders(await authorization_BearerToken())
  );

export const setSurveyName = async (id, name) =>
  await axios.put(
    `/api/surveys/${id}/name`,
    JSON.stringify(name),
    withHeaders(contentType_AppJson, await authorization_BearerToken())
  );

export const getSurveyExport = async (surveyId, type) =>
  await axios.get(
    `/api/surveys/${surveyId}/export?type=${type}`,
    withHeaders(await authorization_BearerToken())
  );
