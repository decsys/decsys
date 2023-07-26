import axios from "axios";
import { withHeaders, authorization_BearerToken } from "./helpers";

export const createWebhook = async (
  surveyId,
  callbackUrl,
  secret,
  verifySsl,
  sourcePage,
  hasCustomTriggers
) => {
  const response = await axios.post(
    "/api/webhooks",
    { surveyId, callbackUrl, secret, verifySsl, sourcePage, hasCustomTriggers },
    withHeaders(await authorization_BearerToken())
  );
  return response.data;
};
