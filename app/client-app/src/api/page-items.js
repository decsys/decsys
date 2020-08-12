import axios from "axios";
import {
  withHeaders,
  contentType_AppJson,
  authorization_BearerToken,
} from "./helpers";

export const deleteSurveyPageItem = async (surveyId, pageId, itemId) =>
  await axios.delete(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${itemId}`,
    withHeaders(await authorization_BearerToken())
  );

export const duplicateSurveyPageItem = async (surveyId, pageId, itemId) =>
  await axios.post(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${itemId}/duplicate`,
    null,
    withHeaders(await authorization_BearerToken())
  );

export const setSurveyPageItemOrder = async (
  surveyId,
  pageId,
  itemId,
  newOrder
) =>
  await axios.put(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${itemId}/order`,
    newOrder,
    withHeaders(contentType_AppJson, await authorization_BearerToken())
  );

export const setSurveyPageItemParam = async (
  surveyId,
  pageId,
  componentId,
  paramKey,
  value
) =>
  await axios.patch(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${componentId}/params`,
    {
      [paramKey]: value,
    },
    withHeaders(await authorization_BearerToken())
  );
