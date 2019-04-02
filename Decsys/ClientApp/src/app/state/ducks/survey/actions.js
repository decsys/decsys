import * as types from "./types";

export const getSurvey = survey => ({
  type: types.GET_SURVEY,
  payload: { survey }
});
