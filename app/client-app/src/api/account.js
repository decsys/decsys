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

export const editProfile = async (data) =>
  (
    await axios.post(
      `/account/profile`,
      data,
      withHeaders(await authorization_BearerToken())
    )
  ).data;

export const requestEmailChange = async (data) =>
  (
    await axios.post(
      `/account/email`,
      data,
      withHeaders(await authorization_BearerToken())
    )
  ).data;
