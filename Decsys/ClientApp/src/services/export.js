import { exportDateFormat } from "../utils/date-formats";
import download from "downloadjs";
import * as api from "../api";

/**
 * Helper for Client-Side file downloads
 */
export const downloadFile = (data, filename, type = "application/json") => {
  const file = new Blob(data, {
    type
  });
  download(file, filename, type);
};

/**
 * ❤ Convert base64 byte arrays from aspnetcore to a native js byte array we can blob
 * https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @param {*} b64Data
 * @param {*} contentType
 * @param {*} sliceSize
 */
const b64toByteArrays = (b64Data, sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return byteArrays;
};

/**
 * Returns a function for downloading survey structure as a json file
 *
 * @param {number|object} survey
 * Either the survey id, or a complete survey object
 *
 * If an id, the survey data for that id will be fetched.
 *
 * If an object, the data passed will be used
 */
export const surveyExport = (survey, type) => {
  const filename = `Survey-${survey.name}_${exportDateFormat(
    new Date()
  )}_${type}`;

  const mime = "application/zip";

  (async () => {
    const { data } = await api.getSurveyExport(survey.id, type);

    return downloadFile(b64toByteArrays(data), `${filename}.zip`, mime);
  })();
};
