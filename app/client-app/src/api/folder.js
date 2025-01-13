import axios from "axios";
import { authorization_BearerToken, withHeaders } from "./helpers";

export const createFolder = async (name) => {
  const response = await axios.post(
    `/api/Folder?name=${name}`,
    null,
    withHeaders(await authorization_BearerToken())
  );
  return response.data;
};
