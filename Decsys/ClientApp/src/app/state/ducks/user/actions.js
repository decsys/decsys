import * as types from "./types";

export const getUserId = (publicIp, privateIp) => ({
  type: types.GET_USER_ID,
  payload: { ip: { public: publicIp, private: privateIp } }
});
