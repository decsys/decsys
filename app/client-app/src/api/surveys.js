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
 * Fetch a List of Filtered Survey Summaries from the API based on various filter, sorting, and pagination parameters.
 * @param {string|null} name - The name to filter surveys by (partial match, optional).
 * @param {string} view - The view to filter surveys by ("unarchived", "archived", or "all"). Defaults to "" (all).
 * @param {string} sortBy - The field to sort surveys by (e.g., "name", "date", etc.). Defaults to "name".
 * @param {string} direction - The direction of sorting ("up" for ascending, "down" for descending). Defaults to "up".
 * @param {number} page - The page number for pagination. Defaults to 1.
 * @param {number} pageSize - The number of surveys per page. Defaults to 10.
 * @returns {Object} An object containing:
 *   - `data`: The fetched survey summaries.
 *   - `mutate`: A function to manually revalidate or update the cached data.
 */
export const useSurveysList = ({
  name = "",
  view = "unarchived",
  sortBy = "name",
  direction = "up",
  isStudy = false,
  canChangeStudy = false,
  pageIndex = 0,
  pageSize = 10,
  parentFolderName = null,
} = {}) => {
  const params = new URLSearchParams({
    name,
    view,
    sortBy,
    direction,
    isStudy: isStudy.toString(),
    canChangeStudy: canChangeStudy.toString(),
    pageIndex: pageIndex.toString(),
    pageSize: pageSize.toString(),
  });

  // Only append parentFolderName if it's not null or undefined
  if (parentFolderName) {
    params.append("parentFolderName", parentFolderName);
  }

  return useSWR(`/api/surveys/?${params.toString()}`, defaultFetcher(true), {
    suspense: true,
  });
};

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
  { isStudy, parentId: parentSurveyId } = {},
  parentFolderName
) =>
  await axios.post(
    "/api/surveys",
    { name, type, settings, isStudy, parentSurveyId, parentFolderName },
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

export const deleteSurvey = async (id, parentFolderName) =>
  await axios.delete(
    `/api/surveys/${id}/${parentFolderName}`,
    withHeaders(await authorization_BearerToken())
  );

export const duplicateSurvey = async (
  id,
  name,
  type,
  settings,
  { isStudy, parentId: parentSurveyId },
  parentFolderName
) =>
  await axios.post(
    `/api/surveys/${id}/duplicate`,
    { name, type, settings, isStudy, parentSurveyId, parentFolderName },
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
 * Sets or removes the parent folder of a specified survey.
 * @param {number} id - The ID of the survey to modify.
 * @param {string|null} folderName - The ID of the folder to set as the parent, or null to remove the parent folder.
 * @returns {Promise<void>} - A promise that resolves when the operation is successful, and rejects if an error occurs.
 */
export const setSurveyFolder = async (id, folderName = null) => {
  try {
    await axios.put(
      `/api/surveys/${id}/folder`,
      folderName,
      withHeaders(contentType_AppJson, await authorization_BearerToken())
    );
  } catch (error) {
    console.error(
      `Error setting folder for survey with ID ${id}:`,
      error.response || error.message
    );
    throw error;
  }
};
