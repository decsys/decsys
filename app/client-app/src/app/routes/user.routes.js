import React from "react";
import { Router } from "@reach/router";
import Register from "app/pages/user/Register";
import UserFeedback from "app/pages/user/Feedback";
import { useServerConfig } from "api/config";
import ForgotPassword from "app/pages/user/ForgotPassword";
import Error from "app/pages/Error";
import ResetPassword from "app/pages/user/ResetPassword";

const User = () => {
  const { allowRegistration } = useServerConfig();
  return (
    <Router>
      {allowRegistration && (
        <>
          <Register path="register" />
          <ForgotPassword path="password/request" />
          <ResetPassword path="password/reset" />
          <UserFeedback path="feedback/*" />
          <Error message="404: Not Found" default />
        </>
      )}
    </Router>
  );
};

export default User;
