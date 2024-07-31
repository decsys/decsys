import axios from "axios";
import { withHeaders, authorization_BearerToken } from "./helpers";

export const listWordlist = async () => {
  const response = await axios.get(
    "/api/wordlists",
    withHeaders(await authorization_BearerToken())
  );
  return response.data;
};

export const fetchWordList = async () => {
  const response = await axios.post(
    "/api/wordlists",
    {},
    withHeaders(await authorization_BearerToken())
  );
  return response.data;
};

export const createWordList = async () => {
  const response = await axios.post(
    "/api/wordlists/create",
    {},
    withHeaders(await authorization_BearerToken())
  );
  return response.data;
};

export const excludeBuiltinWords = async (id, type, word) => {
  const response = await axios.put(
    `/api/wordlists/${id}/exclude/${type}/${word}`,
    {},
    withHeaders(await authorization_BearerToken())
  );
  return response.data;
};

export const includeBuiltinWords = async (id, type, word) =>
  await axios.delete(
    `/api/wordlists/${id}/exclude/${type}/${word}`,
    withHeaders(await authorization_BearerToken())
  );
