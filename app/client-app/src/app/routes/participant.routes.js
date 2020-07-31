import React from "react";
import { Router } from "@reach/router";
import Error from "app/pages/Error";
import Survey from "app/pages/Survey";
import SurveyIdEntry from "app/pages/SurveyIdEntry";

const Participant = () => {
  return (
    <Router>
      <SurveyIdEntry path="/" />
      <Survey path="/:id" />
      <Error message="404: Not Found" default />
    </Router>
  );
};

export default Participant;
