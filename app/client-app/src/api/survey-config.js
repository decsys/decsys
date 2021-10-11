import useSWR from "swr";
import {
  defaultFetcher,
  withHeaders,
  authorization_BearerToken,
} from "./helpers";
import axios from "axios";

export const useSurveyConfig = (surveyId) =>
  useSWR(`/api/surveys/${surveyId}/config`, defaultFetcher(true), {
    suspense: true,
    revalidateOnFocus: false,
  });

export const saveSurveyConfig = async (surveyId, config) =>
  await axios.put(
    `/api/surveys/${surveyId}/config`,
    config,
    withHeaders(await authorization_BearerToken())
  );

export const saveSurveySettings = async (surveyId, settings) =>
  await axios.put(
    `/api/surveys/${surveyId}/settings`,
    settings,
    withHeaders(await authorization_BearerToken())
  );
