import axios from "axios";
import { apiCallFactory, uploadFile, defaultFetcher } from "./helpers";
import useSWR from "swr";

// export const listSurveys = apiCallFactory(
//   "/api/surveys",
//   async (url) => (await axios.get(url)).data
// ); // TODO: do we need a separate simple get request?

export const useSurveysList = () =>
  useSWR("/api/surveys", defaultFetcher, { suspense: true });

export const createSurvey = async () => await axios.post("/api/surveys");

export const uploadSurveyImport = async (file, importData = false) =>
  await uploadFile(`/api/surveys/import?importData=${importData}`, file);

export const loadInternalSurvey = async type =>
  await axios.post(`/api/surveys/internal/${type}`);
