import axios from "axios";
import {
  withHeaders,
  authorization_BearerToken,
  defaultFetcher,
} from "./helpers";
import useSWR from "swr";

export const createWebhook = async (
  surveyId,
  callbackUrl,
  secret,
  verifySsl,
  sourcePages,
  hasCustomTriggers,
  pageNavigation
) => {
  let eventTypes = {};

  if (pageNavigation) {
    eventTypes.PAGE_NAVIGATION = sourcePages.map((page) => ({
      sourcePage: page,
    }));
  } else {
    eventTypes.PAGE_NAVIGATION = null;
  }

  const response = await axios.post(
    "/api/webhooks",
    {
      surveyId,
      callbackUrl,
      secret,
      verifySsl,
      triggerCriteria: {
        eventTypes,
        hasCustomTriggers,
      },
    },
    withHeaders(await authorization_BearerToken())
  );
  return response.data;
};

export const generateWebhookSecret = async () => {
  const response = await axios.get(
    "/api/Webhooks/generate-secret",
    withHeaders(await authorization_BearerToken())
  );
  return response.data;
};

export const useWebhook = (surveyId) =>
  useSWR(`/api/webhooks/survey/${surveyId}`, defaultFetcher(true), {
    suspense: true,
  });

export const deleteWebhook = async (webhookId) => {
  const response = await axios.delete(
    `/api/webhooks/${webhookId}`,
    withHeaders(await authorization_BearerToken())
  );
  return response.data;
};

export const getWebhook = async (webhookId) => {
  const response = await axios.get(
    `/api/webhooks/${webhookId}`,
    withHeaders(await authorization_BearerToken())
  );
  return response.data;
};
