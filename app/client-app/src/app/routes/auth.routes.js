import React from "react";
import { Router } from "@reach/router";
import { Paths } from "auth/constants";
import Login from "app/pages/Login/Login";
import CompleteSignIn from "./auth/CompleteSignIn";

// Dummy login routes
const RequestSignIn = () => <div>SignIn Requested</div>;
const RequestSignOut = () => <div>SignOut Requested</div>;
const CompleteSignOut = () => <div>Completing SignOut</div>;

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
