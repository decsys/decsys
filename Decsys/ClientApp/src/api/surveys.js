import axios from "axios";
import { uploadFile, defaultFetcher } from "./helpers";
import useSWR from "swr";

export const useSurveysList = () =>
  useSWR("/api/surveys", defaultFetcher, { suspense: true });

export const createSurvey = async () => await axios.post("/api/surveys");

export const uploadSurveyImport = async (file, importData = false) =>
  await uploadFile(`/api/surveys/import?importData=${importData}`, file);

export const loadInternalSurvey = async type =>
  await axios.post(`/api/surveys/internal/${type}`);

export const deleteSurvey = async id =>
  await axios.delete(`/api/surveys/${id}`);

export const duplicateSurvey = async id =>
  await axios.post(`/api/surveys/${id}/duplicate`);

export const launchSurvey = async id =>
  await axios.post(`/api/surveys/${id}/instances`);

export const closeSurveyInstance = async (surveyId, instanceId) =>
  await axios.post(`/api/surveys/${surveyId}/instances/${instanceId}/close`);
