import axios from "axios";
import { withHeaders, authorization_BearerToken } from "./helpers";

export const createWebhook = async (
  surveyId,
  callbackUrl,
  secret,
  verifySsl,
  sourcePages,
  hasCustomTriggers
) => {
  const eventTypes = {
    PAGE_NAVIGATION: sourcePages.map((page) => ({ sourcePage: page })),
  };

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
