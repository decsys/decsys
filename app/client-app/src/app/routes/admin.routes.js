import React from "react";
import { Router, navigate } from "@reach/router";
import Error from "app/pages/Error";
import { useUsers } from "auth/UsersContext";
import Surveys from "app/pages/Surveys";
import Editor from "app/pages/Editor";
import Preview from "app/pages/Preview";
import Results from "app/pages/Results";
import Dashboard from "app/pages/Dashboard";
import { Paths } from "auth/constants";
import { IfFulfilled, useAsync } from "react-async";
import Loading from "app/pages/Loading";

const Admin = () => {
  const { isAdmin } = useUsers();
  const { run, ...state } = useAsync({
    promiseFn: isAdmin,
    onResolve: (isAdmin) => !isAdmin && navigate(Paths.RequestSignIn("true")),
    suspense: true,
  });

  return (
    <IfFulfilled state={state}>
      {(isAdmin) => {
        console.log(isAdmin);
        return isAdmin ? (
          <Router>
            <Surveys path="/" />
            <Editor path="/survey/:id" />
            <Preview path="/survey/:id/preview" />
            <Results path="/survey/:id/results" />
            <Dashboard path="/survey/dashboard/:combinedId" />
            <Error message="404: Not Found" default />
          </Router>
        ) : (
          <Loading />
        );
      }}
    </IfFulfilled>
  );
};

export default Admin;
