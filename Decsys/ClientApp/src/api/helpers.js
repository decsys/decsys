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
