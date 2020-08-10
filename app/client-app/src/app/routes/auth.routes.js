import React from "react";
import { Router } from "@reach/router";
import { Paths } from "auth/constants";
import Login from "app/pages/Login/Login";

// Dummy login routes
const RequestSignIn = () => <div>SignIn Requested</div>;
const RequestSignOut = () => <div>SignOut Requested</div>;
const CompleteSignIn = () => <div>Completing SignIn</div>;
const CompleteSignOut = () => <div>Completing SignOut</div>;

const Auth = () => (
  <Router>
    <Login path={Paths.LoginForm()} />
    <RequestSignIn path={Paths.RequestSignIn()} />
    <CompleteSignIn path={Paths.CompleteSignIn()} />
    {/* <AuthCallback
      path={Paths.LoginCallback()}
      callbackType={CallbackTypes.Login}
    /> */}
    <RequestSignOut path={Paths.RequestSignOut()} />
    <CompleteSignOut path={Paths.CompleteSignOut()} />
    {/* <AuthCallback
      path={Paths.LogoutCallback()}
      callbackType={CallbackTypes.Logout}
    /> */}
  </Router>
);

export default Auth;
