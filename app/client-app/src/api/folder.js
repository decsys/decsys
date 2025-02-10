import axios from "axios";
import { authorization_BearerToken, withHeaders } from "./helpers";
import { defaultFetcher } from "./helpers";
import useSWR from "swr";

export const createFolder = async (name) => {
  const response = await axios.post(
    `/api/Folder?name=${name}`,
    null,
    withHeaders(await authorization_BearerToken())
  );
  return response.data;
};

export const checkExistingFolder = async (name) => {
  const response = await axios.get(
    `/api/Folder/${name}`,
    withHeaders(await authorization_BearerToken())
  );
  return response.data;
};

export const useFolders = (pageIndex = 0, pageSize = 10) => {
  const queryString = new URLSearchParams({
    pageIndex: pageIndex.toString(),
    pageSize: pageSize.toString(),
  }).toString();

  return useSWR(`/api/Folder/?${queryString}`, defaultFetcher(true), {
    suspense: true,
  });
};

export const deleteFolder = async (name) => {
  const headers = await withHeaders(await authorization_BearerToken());
  const response = await axios.delete(`/api/Folder/${name}`, headers);
  return response.data;
};
