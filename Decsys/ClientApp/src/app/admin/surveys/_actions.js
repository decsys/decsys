import * as types from "../../common/_types";

export const LaunchSession = id => ({
  type: types.LAUNCH_SESSION,
  id
});

export const CloseSession = id => ({
  type: types.CLOSE_SESSION,
  id
});
