import useSWR from "swr";
import { defaultFetcher } from "./helpers";
import axios from "axios";

export const useSurveyInstance = (surveyId, instanceId) =>
  useSWR(`/api/surveys/${surveyId}/instances/${instanceId}`, defaultFetcher, {
    suspense: true
  });

export const closeSurveyInstance = async (surveyId, instanceId) =>
  await axios.post(`/api/surveys/${surveyId}/instances/${instanceId}/close`);
