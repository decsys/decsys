import React from "react";
import { Router } from "@reach/router";
import Error from "app/pages/Error";
import Survey from "app/pages/Survey";

const Participant = () => {
  return (
    <Router>
      <Survey path="/survey/:id" />
      <Error message="404: Not Found" default />
    </Router>
  );
};

export default Participant;
