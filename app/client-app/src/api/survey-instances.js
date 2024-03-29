import useSWR from "swr";
import {
  defaultFetcher,
  withHeaders,
  authorization_BearerToken,
} from "./helpers";
import axios from "axios";

const urls = {
  instanceResultsSummary: (surveyId, instanceId) =>
    `/api/surveys/${surveyId}/instances/${instanceId}/results`,
};

export const getExternalSurveyDetails = async (params, surveyId) =>
  (
    await axios.post(
      `/api/surveys/external${surveyId != null ? `/${surveyId}` : ""}`,
      params,
      withHeaders(await authorization_BearerToken())
    )
  ).data;

export const useSurveyInstance = (surveyId, instanceId) =>
  useSWR(
    `/api/surveys/${surveyId}/instances/${instanceId}`,
    defaultFetcher(true),
    {
      suspense: true,
    }
  );

export const useSurveyInstancesList = (surveyId) =>
  useSWR(`/api/surveys/${surveyId}/instances`, defaultFetcher(true), {
    suspense: true,
  });

/**
 * Fetch SurveyInstance Results Summary using SWR, and re-polling every 10 seconds
 * @param {*} surveyId
 * @param {*} instanceId
 */
export const useSurveyInstanceResultsSummary = (surveyId, instanceId) =>
  useSWR(
    urls.instanceResultsSummary(surveyId, instanceId),
    defaultFetcher(true),
    {
      suspense: true,
      refreshInterval: 10000,
    }
  );

export const closeSurveyInstance = async (surveyId, instanceId) =>
  await axios.post(
    `/api/surveys/${surveyId}/instances/${instanceId}/close`,
    null,
    withHeaders(await authorization_BearerToken())
  );

export const getInstanceResultsSummary = async (surveyId, instanceId) =>
  await axios.get(
    urls.instanceResultsSummary(surveyId, instanceId),
    withHeaders(await authorization_BearerToken())
  );

export const getInstanceResultsFull = async (surveyId, instanceId) =>
  await axios.get(
    `/api/surveys/${surveyId}/instances/${instanceId}/results?type=full`,
    withHeaders(await authorization_BearerToken())
  );
