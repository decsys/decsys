import React from "react";
import { Router } from "@reach/router";
import Error from "app/pages/Error";
import Surveys from "app/pages/Surveys";
import Editor from "app/pages/Editor";
import Preview from "app/pages/Preview";
import Results from "app/pages/Results";
import Dashboard from "app/pages/Dashboard";
import Loading from "app/pages/Loading";
import { useAuth } from "auth/AuthContext";

const Admin = () => {
  const { isAdmin, user, login } = useAuth();

  if (!user) {
    login();
    return <Loading />;
  }

  if (!isAdmin) return <Error message="403: Forbidden" default />;

  return (
    <Router>
      <Surveys path="/" />
      <Editor path="/survey/:id" />
      <Preview path="/survey/:id/preview" />
      <Results path="/survey/:id/results" />
      <Dashboard path="/survey/dashboard/:combinedId" />
      <Error message="404: Not Found" default />
    </Router>
  );
};

export default Admin;
