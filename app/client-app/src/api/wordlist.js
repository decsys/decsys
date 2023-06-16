import axios from "axios";
import { withHeaders, authorization_BearerToken } from "./helpers";

export const fetchWordList = async () => {
  try {
    const headers = await authorization_BearerToken();
    const response = await axios.post(
      "/api/wordlists",
      {},
      withHeaders(headers)
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching word list:", error);
    throw error;
  }
};
