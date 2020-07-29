import React from "react";
import { Router } from "@reach/router";
import Error from "app/pages/Error";
import { useUsers } from "contexts/UsersContext";
import Survey from "app/pages/Survey";

const Participant = () => {
  // const { user } = useUsers();
  // if (!user.roles.admin) return <Error message="401: Unauthorised" />;

  return (
    <Router>
      <Survey path="/survey/:id" />
      <Error message="404: Not Found" default />
    </Router>
  );
};

export default Participant;
