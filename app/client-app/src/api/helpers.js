import axios from "axios";
import { users } from "auth/UsersContext";

export const defaultFetcher = (withToken) => async (url) => {
  console.log(withToken);
  console.log(withHeaders(await authorization_BearerToken()));
  return (
    await axios.get(
      url,
      withToken ? withHeaders(await authorization_BearerToken()) : {}
    )
  ).data;
};

export const uploadFile = async (url, file, method = "post") => {
  const formData = new FormData();
  formData.append("file", file);
  await axios[method](url, formData, {
    headers: {
      "content-type": "multipart/form-data",
      ...authorization_BearerToken(),
    },
  });
};

/**
 * for when we send a string not a JSON object as body data
 */
export const contentType_AppJson = {
  "Content-Type": "application/json",
};

export const authorization_BearerToken = async () => {
  const token = (await users.getUser())?.access_token;

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const withHeaders = (...headerKvps) => ({
  headers: headerKvps.reduce(
    (a, kvp) => ({
      ...a,
      ...kvp,
    }),
    {}
  ),
});
