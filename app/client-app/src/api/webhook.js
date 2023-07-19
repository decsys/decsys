import { withHeaders, authorization_BearerToken } from "./helpers";

export const createWebhook = async (name) => {
  const response = await axios.post(
    "api/webhook",
    { name },
    withHeaders(await authorization_BearerToken())
  );
  return response.data;
};
