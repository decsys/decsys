import React from "react";
import { Router } from "@reach/router";
import { Paths } from "auth/constants";
import Login from "app/pages/Login/Login";
import { CompleteSignIn, CompleteSignOut } from "./auth/CompleteAuth";
import RequestSignIn from "./auth/RequestSignIn";
import RequestSignOut from "./auth/RequestSignOut";

const Auth = () => (
  <Router>
    <Login path={Paths.LoginForm()} />
    <RequestSignIn path={Paths.RequestSignIn()} />
    <CompleteSignIn path={Paths.CompleteSignIn()} />
    <RequestSignOut path={Paths.RequestSignOut()} />
    <CompleteSignOut path={Paths.CompleteSignOut()} />
  </Router>
);

export default Auth;
