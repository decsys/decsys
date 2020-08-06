import useSWR from "swr";
import { defaultFetcher } from "./helpers";
import axios from "axios";

const urls = {
  instanceResultsSummary: (surveyId, instanceId) =>
    `/api/surveys/${surveyId}/instances/${instanceId}/results`,
};

export const useSurveyInstance = (surveyId, instanceId) =>
  useSWR(`/api/surveys/${surveyId}/instances/${instanceId}`, defaultFetcher, {
    suspense: true,
  });

export const useSurveyInstancesList = (surveyId) =>
  useSWR(`/api/surveys/${surveyId}/instances`, defaultFetcher, {
    suspense: true,
  });

/**
 * Fetch SurveyInstance Results Summary using SWR, and re-polling every 10 seconds
 * @param {*} surveyId
 * @param {*} instanceId
 */
export const useSurveyInstanceResultsSummary = (surveyId, instanceId) =>
  useSWR(urls.instanceResultsSummary(surveyId, instanceId), defaultFetcher, {
    suspense: true,
    refreshInterval: 10000,
  });

export const closeSurveyInstance = async (surveyId, instanceId) =>
  await axios.post(`/api/surveys/${surveyId}/instances/${instanceId}/close`);

export const getInstanceResultsSummary = (surveyId, instanceId) =>
  axios.get(urls.instanceResultsSummary(surveyId, instanceId));

export const getInstanceResultsFull = (surveyId, instanceId) =>
  axios.get(
    `/api/surveys/${surveyId}/instances/${instanceId}/results?type=full`
  );
