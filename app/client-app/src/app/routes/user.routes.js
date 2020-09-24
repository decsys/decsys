import React from "react";
import { Router } from "@reach/router";
import Register from "app/pages/user/Register";
import UserFeedback from "app/pages/user/Feedback";
import { useServerConfig } from "api/config";
import ForgotPassword from "app/pages/user/ForgotPassword";
import Error from "app/pages/Error";
import ResetPassword from "app/pages/user/ResetPassword";
import Profile from "app/pages/user/Profile";
import { useAuth } from "auth/AuthContext";
import Loading from "app/pages/Loading";
import ChangePassword from "app/pages/user/ChangePassword";

const Protected = ({ as: SuccessRoute, ...p }) => {
  const { user, login, isSuperUser } = useAuth();
  if (!user) {
    login();
    return <Loading {...p} />;
  }

  // NO `user` routes at this time are available to the SuperUser!
  if (isSuperUser) return <Error message="403: Forbidden" />;

  return <SuccessRoute {...p} />;
};

const User = () => {
  const { allowRegistration } = useServerConfig();

  return (
    <Router>
      {allowRegistration && (
        <>
          <Register path="register" />
          <ForgotPassword path="password/request" />
          <ResetPassword path="password/reset" />

          <Protected as={Profile} path="profile" />
          <Protected as={ChangePassword} path="password" />
          <Protected as={Profile} path="email" />

          <UserFeedback path="feedback/*" />
        </>
      )}
      <Error message="404: Not Found" default />
    </Router>
  );
};

export default User;
