import axios from "axios";
import { withHeaders, authorization_BearerToken } from "./helpers";

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

export const listWebhook = async (surveyId) => {
  const response = await axios.get(
    `/api/webhooks/${surveyId}`,
    withHeaders(await authorization_BearerToken())
  );
  return response.data;
};
