import { navigate } from "@reach/router";
import Error from "./Error";

export const errorCallToAction = {
  label: "Try a different ID",
  onClick: () => {
    navigate("/survey");
  },
};

const SurveyNotFoundError = () => (
  <Error
    message="We couldn't find that Survey. It may have closed already."
    callToAction={errorCallToAction}
  />
);

export default SurveyNotFoundError;
