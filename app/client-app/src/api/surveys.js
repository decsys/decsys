import axios from "axios";
import {
  uploadFile,
  defaultFetcher,
  withHeaders,
  authorization_BearerToken,
  contentType_AppJson,
} from "./helpers";
import useSWR, { mutate } from "swr";
import { toDictionary } from "services/data-structures";

/**
 * Fetch a List of Survey Summaries from the API
 */
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

/**
 * Fetch a List of Child Survey Summaries from the API using SWR
 * @param {*} id The ID of the Parent Survey to fetch Children of
 * @returns `{data, mutate}`
 */
export const useChildList = (id) =>
  useSWR(`/api/surveys/${id}/children`, defaultFetcher(true), {
    suspense: true,
  });

export const createSurvey = async (
  name,
  type,
  settings,
  { isStudy, parentId: parentSurveyId } = {}
) =>
  await axios.post(
    "/api/surveys",
    { name, type, settings, isStudy, parentSurveyId },
    withHeaders(await authorization_BearerToken())
  );

export const uploadSurveyImport = async (
  file,
  importData = false,
  name,
  type,
  settings,
  { isStudy, parentId: parentSurveyId } = {}
) =>
  await uploadFile(
    `/api/surveys/import?importData=${importData}`,
    file,
    "post",
    {
      name,
      type,
      settings,
      isStudy,
      parentSurveyId,
    }
  );

export const loadInternalSurvey = async (
  internalKey,
  name,
  type,
  settings,
  parentSurveyId
) =>
  await axios.post(
    `/api/surveys/internal/${internalKey}`,
    { name, type, settings, parentSurveyId },
    withHeaders(await authorization_BearerToken())
  );

export const deleteSurvey = async (id) =>
  await axios.delete(
    `/api/surveys/${id}`,
    withHeaders(await authorization_BearerToken())
  );

export const duplicateSurvey = async (
  id,
  name,
  type,
  settings,
  { isStudy, parentId: parentSurveyId }
) =>
  await axios.post(
    `/api/surveys/${id}/duplicate`,
    { name, type, settings, isStudy, parentSurveyId },
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

export const setParent = async (id, parentId) => {
  await axios.put(
    `/api/surveys/${id}/parent/${parentId ?? ""}`,
    null,
    withHeaders(contentType_AppJson, await authorization_BearerToken())
  );
};

export const getSurveyExport = async (surveyId, type) =>
  await axios.get(
    `/api/surveys/${surveyId}/export?type=${type}`,
    withHeaders(await authorization_BearerToken())
  );

/**
 * Archive a Survey by ID
 * @param {number} id The ID of the Survey to archive
 */
export const archiveSurvey = async (id) => {
  try {
    await axios.post(
      `/api/surveys/${id}/archive`,
      null,
      withHeaders(await authorization_BearerToken())
    );
    await mutate("/api/surveys");
  } catch (error) {
    console.error(
      `Error archiving survey with ID ${id}:`,
      error.response || error.message
    );
    throw error;
  }
};

/**
 * Unarchive a Survey by ID
 * @param {number} id The ID of the Survey to unarchive
 */
export const unarchiveSurvey = async (id) => {
  try {
    await axios.post(
      `/api/surveys/${id}/unarchive`,
      null,
      withHeaders(await authorization_BearerToken())
    );
    await mutate("/api/surveys");
  } catch (error) {
    console.error(
      `Error unarchiving survey with ID ${id}:`,
      error.response || error.message
    );
    throw error;
  }
};

/**
 * Fetch a List of Filtered Survey Summaries from the API based on name and view parameters
 * @param {string|null} name - The name to filter surveys by (partial match)
 * @param {string} view - The view to filter surveys by (all, active, or archived)
 * @returns `{data, mutate}`
 */
export const useFilteredSurveys = (name, view = "all") => {
  const queryString = new URLSearchParams({ name, view }).toString();

  return useSWR(`/api/surveys/filtered?${queryString}`, defaultFetcher(true), {
    suspense: true,
  });
};
