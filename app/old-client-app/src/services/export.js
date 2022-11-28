import { exportDateFormat } from "services/date-formats";
import download from "downloadjs";
import { parse } from "json2csv";
import { getSurveyExport } from "api/surveys";

/**
 * Helper for Client-Side file downloads
 */
export const downloadFile = (data, filename, type = "application/json") => {
  const file = new Blob(data, {
    type,
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
  const filename = `Survey-${name}_${
    exportDateFormat(new Date()).flat
  }_${type}`;
  const mime = "application/zip";
  const { data } = await getSurveyExport(id, type);
  return downloadFile(b64toByteArrays(data), `${filename}.zip`, mime);
};

export const getResultsCsvData = (results) => {
  //figure out all the response columns we need
  const responseColumns = results.participants.reduce(
    (agg, p) => {
      const responseColumns = p.responses
        .map((x) => {
          return !x.response
            ? null
            : Object.keys(x.response).map((r) => ({
                label: `${x.responseType}_${r}`,
                value: `responses.${x.responseType}.${r}`,
              }));
        })
        .filter((x) => !!x); // drop the null ones

      responseColumns.forEach((response) => {
        response.forEach((column) => {
          agg.columns.push(column);
        });
      });
      return agg;
    },
    { lookup: {}, columns: [] }
  ).columns;
  const participants = results.participants.map((participant) => {
    participant.responses.map((response) => {
      response[response.responseType] = {};
      Object.keys(response.response).forEach((key) => {
        response[response.responseType][key] = response.response[key];
      });
    });
    return participant;
  });

  const data = parse(participants, {
    fields: [
      { label: "Participant", value: "id" },
      { label: "Page", value: "responses.page" },
      { label: "Page Name", value: "responses.pageName" },
      { label: "Question", value: "responses.question" },
      { label: "Order", value: "responses.order" },
      { label: "Page Loaded", value: "responses.pageLoad" },
      { label: "Response Type", value: "responses.responseType" },
      { label: "Response Recorded", value: "responses.responseRecorded" },
      ...responseColumns,
    ],
    unwind: "responses",
  });
  return data;
};
