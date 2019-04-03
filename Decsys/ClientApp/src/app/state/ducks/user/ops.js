import * as actions from "./actions";
import axios from "axios";

export const getUserId = instanceId => async dispatch => {
  const key = `${instanceId}_participantId`;
  // this is all for anonymous access right now
  // check local storage first
  let id = localStorage.getItem(key);
  if (!id) {
    // nothing in local storage? ask the server for an id
    id = (await axios.get("/api/identity/anonymous")).data.id;
    // chuck it in local storage for the future :3
    localStorage.setItem(key, id);
  }
  dispatch(actions.getUserId(id));
};
