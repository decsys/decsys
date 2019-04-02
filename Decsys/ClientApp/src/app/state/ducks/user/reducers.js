import * as types from "./types";
import getClientIp from "../../../utils/get-client-ip";

const surveyEditorReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_USER_ID:
      return {
        ...state
      };
    default:
      return state;
  }
};
