import axios from "axios";

export const defaultFetcher = async url => (await axios.get(url)).data;

export const uploadFile = async (url, file, method = "post") => {
  const formData = new FormData();
  formData.append("file", file);
  await axios[method](url, formData, {
    headers: {
      "content-type": "multipart/form-data"
    }
  });
};

/**
 * for when we send a string not a JSON object as body data
 */
export const appJsonHeaderOptions = {
  headers: {
    "Content-Type": "application/json"
  }
};
