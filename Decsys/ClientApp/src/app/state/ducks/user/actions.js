import * as types from "./types";

export const getUserId = id => ({
  type: types.GET_USER_ID,
  payload: { id }
});
