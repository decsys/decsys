import axios from "axios";
import { withHeaders, authorization_BearerToken } from "./helpers";

export const fetchWordList = async () => {
  const response = await axios.post(
    "/api/wordlists",
    {},
    withHeaders(await authorization_BearerToken())
  );
  return response.data;
};

export const excludeBuiltinWords = async (id, type, word) => {
  const response = await axios.post(
    `/api/wordlists/${id}/exclude/${type}/${word}`,
    {},
    withHeaders(await authorization_BearerToken())
  );
  return response.data;
};
