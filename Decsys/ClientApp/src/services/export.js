import { exportDateFormat } from "services/date-formats";
import download from "downloadjs";
import * as api from "api";

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
 * Download survey structure as a json file
 */
export const surveyExport = async (id, name, type) => {
  const filename = `Survey-${name}_${exportDateFormat(new Date())}_${type}`;
  const mime = "application/zip";
  const { data } = await api.getSurveyExport(id, type);
  return downloadFile(b64toByteArrays(data), `${filename}.zip`, mime);
};
