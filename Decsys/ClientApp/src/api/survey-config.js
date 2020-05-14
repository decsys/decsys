import useSWR from "swr";
import { defaultFetcher } from "./helpers";
import axios from "axios";

export const useSurveyConfig = surveyId =>
  useSWR(`/api/surveys/${surveyId}/config`, defaultFetcher, {
    suspense: true,
    revalidateOnFocus: false
  });

export const saveSurveyConfig = async (surveyId, config) =>
  axios.put(`/api/surveys/${surveyId}/config`, config);
