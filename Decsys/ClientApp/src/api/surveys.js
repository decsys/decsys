import axios from "axios";
import { uploadFile, defaultFetcher, appJsonHeaderOptions } from "./helpers";
import useSWR from "swr";
import { toDictionary } from "services/data-structures";

export const useSurveysList = () =>
  useSWR(
    "/api/surveys",
    async url => {
      const surveys = await defaultFetcher(url);
      return toDictionary(surveys);
    },
    { suspense: true }
  );

export const useSurvey = id =>
  useSWR(
    `/api/surveys/${id}`,
    async url => {
      const survey = await defaultFetcher(url);
      return {
        ...survey,
        pages: toDictionary(
          survey.pages.map(p => ({
            ...p,
            components: toDictionary(p.components),
            componentOrder: p.components.map(p => p.id)
          }))
        ),
        pageOrder: survey.pages.map(p => p.id)
      };
    },
    { suspense: true }
  );

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

export const setSurveyName = async (id, name) =>
  await axios.put(
    `/api/surveys/${id}/name`,
    JSON.stringify(name),
    appJsonHeaderOptions
  );
