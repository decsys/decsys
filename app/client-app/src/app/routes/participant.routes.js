import { Router } from "@reach/router";
import Error from "app/pages/Error";
import Survey from "app/pages/Survey";
import SurveyComplete from "app/pages/SurveyComplete";
import SurveyIdEntry from "app/pages/SurveyIdEntry";

const Participant = () => {
  return (
    <Router>
      <SurveyIdEntry path="/" />
      <Survey path="/:id" />
      <SurveyComplete path="/:id/complete" />
      <Error message="404: Not Found" default />
    </Router>
  );
};

export default Participant;
