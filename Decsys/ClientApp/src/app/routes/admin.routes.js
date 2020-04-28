import React from "react";
import { Router } from "@reach/router";
import Error from "app/pages/Error";
import { useUsers } from "contexts/UsersContext";
import SurveysScreen from "app/screens/admin/SurveysScreen";

const Admin = () => {
  const { user } = useUsers();

  if (!user.roles.admin) return <Error message="401: Unauthorised" />;

  return (
    <Router>
      <Error path="/" message="Surveys" />
      {/* <SurveysScreen path="/" /> */}
    </Router>
  );
};

export default Admin;
