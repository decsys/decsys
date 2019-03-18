import axios from "axios";
import { push } from "connected-react-router";

/**
 * Create a new Survey with the default name,
 * and take the user to the Survey Editor
 */
export const createSurvey = () => dispatch =>
  // create the survey
  axios.post("/api/surveys").then(
    // redirect to the editor with this survey
    response => dispatch(push(`survey/${response.data}`))
  );
