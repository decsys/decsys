import axios from "axios";
import { uploadFile, defaultFetcher, appJsonHeaderOptions } from "./helpers";
import useSWR from "swr";
import { toDictionary } from "services/data-structures";

export const useSurveysList = () =>
  useSWR(
    "/api/surveys",
    async (url) => {
      const surveys = await defaultFetcher(url);
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
  useSWR(`/api/surveys/${id}`, defaultFetcher, { suspense: true });

export const createSurvey = async () => await axios.post("/api/surveys");

export const uploadSurveyImport = async (file, importData = false) =>
  await uploadFile(`/api/surveys/import?importData=${importData}`, file);

export const loadInternalSurvey = async (type) =>
  await axios.post(`/api/surveys/internal/${type}`);

export const deleteSurvey = async (id) =>
  await axios.delete(`/api/surveys/${id}`);

export const duplicateSurvey = async (id) =>
  await axios.post(`/api/surveys/${id}/duplicate`);

export const launchSurvey = async (id) =>
  await axios.post(`/api/surveys/${id}/instances`);

export const setSurveyName = async (id, name) =>
  await axios.put(
    `/api/surveys/${id}/name`,
    JSON.stringify(name),
    appJsonHeaderOptions
  );

export const getSurveyExport = async (surveyId, type) =>
  await axios.get(`/api/surveys/${surveyId}/export?type=${type}`);
