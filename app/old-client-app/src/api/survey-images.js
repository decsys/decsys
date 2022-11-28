import axios from "axios";
import { uploadFile, withHeaders, authorization_BearerToken } from "./helpers";

export const uploadPageItemImage = async (surveyId, pageId, itemId, file) =>
  uploadFile(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${itemId}/image`,
    file,
    "put"
  );

export const deletePageItemImage = async (surveyId, pageId, itemId) =>
  await axios.delete(
    `/api/surveys/${surveyId}/pages/${pageId}/components/${itemId}/image`,
    withHeaders(await authorization_BearerToken())
  );
