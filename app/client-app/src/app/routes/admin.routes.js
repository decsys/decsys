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
import { WORKSHOP } from "constants/app-modes";

const Admin = () => {
  const { isAdmin, mode } = useUsers();
  const { run, ...state } = useAsync({
    promiseFn: isAdmin,
    onResolve: (isAdmin) =>
      !isAdmin && mode !== WORKSHOP && navigate(Paths.RequestSignIn("true")),
    suspense: true,
  });

  return (
    <IfFulfilled state={state}>
      {(isAdmin) =>
        isAdmin ? (
          <Router>
            <Surveys path="/" />
            <Editor path="/survey/:id" />
            <Preview path="/survey/:id/preview" />
            <Results path="/survey/:id/results" />
            <Dashboard path="/survey/dashboard/:combinedId" />
            <Error message="404: Not Found" default />
          </Router>
        ) : mode === WORKSHOP ? (
          <Error message="401: Not Authorized" default />
        ) : (
          <Loading />
        )
      }
    </IfFulfilled>
  );
};

export default Admin;
