import axios from "axios";
import { appJsonHeaderOptions } from "./helpers";

export const deleteSurveyPageItem = (surveyId, pageId, itemId) =>
  axios.delete(`/api/surveys/${surveyId}/pages/${pageId}/components/${itemId}`);

export const duplicateSurveyPageItem = (surveyId, pageId, itemId) =>
  axios.post(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${itemId}/duplicate`
  );

export const setSurveyPageItemOrder = (surveyId, pageId, itemId, newOrder) =>
  axios.put(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${itemId}/order`,
    newOrder,
    appJsonHeaderOptions
  );
