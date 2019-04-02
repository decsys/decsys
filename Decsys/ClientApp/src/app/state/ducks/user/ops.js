import * as actions from "./actions";
import axios from "axios";
import getClientIp from "../../../utils/get-client-ip";

export const getUserId = () => dispatch =>
  axios
    .get("/api/identity/ip")
    .then(({ ip }) =>
      getClientIp().then(ips => dispatch(actions.getUserId(ip, ips[0])))
    );
