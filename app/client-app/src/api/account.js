import axios from "axios";
import { authorization_BearerToken, withHeaders } from "./helpers";

export const changePassword = async (data) =>
  (
    await axios.post(
      `/account/password`,
      data,
      withHeaders(await authorization_BearerToken())
    )
  ).data;
