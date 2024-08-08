import axios from "axios";
import {
  withHeaders,
  authorization_BearerToken,
  contentType_AppJson,
  defaultFetcher,
} from "./helpers";
import useSWR from "swr";

export const listWordlist = async () => {
  const response = await axios.get(
    "/api/wordlists",
    withHeaders(await authorization_BearerToken())
  );
  return response.data;
};

export const createWordList = async (name) => {
  const response = await axios.post(
    "/api/wordlists",
    { name },
    withHeaders(await authorization_BearerToken())
  );
  return response.data;
};

export const setWordlistName = async (id, name) =>
  await axios.put(
    `/api/wordlists/${id}/name`,
    JSON.stringify(name),
    withHeaders(contentType_AppJson, await authorization_BearerToken())
  );

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

export const deleteWordlist = async (wordlistId) => {
  const headers = withHeaders(await authorization_BearerToken());
  const response = await axios.delete(`/api/wordlists/${wordlistId}`, headers);
  console.log("Wordlist deleted successfully:", response.data);
  return true;
};

export const getWordlistById = (id) =>
  useSWR(`/api/wordlists/${id}`, defaultFetcher(true), { suspense: true });
