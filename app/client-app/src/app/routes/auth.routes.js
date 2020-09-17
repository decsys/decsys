import React from "react";
import { Router } from "@reach/router";
import { Paths } from "auth/constants";
import Login from "app/pages/Login/Login";
import CompleteSignIn from "./auth-callbacks/CompleteSignIn";

const Auth = () => (
  <Router>
    <Login path={Paths.LoginForm()} />
    <CompleteSignIn path={Paths.CompleteSignIn()} />
  </Router>
);

export default Auth;
