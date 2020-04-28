import React from "react";
import { Router } from "@reach/router";
import ErrorScreen from "app/screens/ErrorScreen";
import { useUsers } from "contexts/UsersContext";
import SurveysScreen from "app/screens/admin/SurveysScreen/new";

const Admin = () => {
  const { user } = useUsers();

  if (!user.roles.admin) return <ErrorScreen message="401: Unauthorised" />;

  return (
    <Router>
      <SurveysScreen path="/" />
    </Router>
  );
};

export default Admin;
