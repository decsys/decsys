import React from "react";
import { Router } from "@reach/router";
import Register from "app/pages/Register/Register";
import UserFeedback from "app/pages/UserFeedback";
import { useServerConfig } from "api/config";

const User = () => {
  const { allowRegistration } = useServerConfig();
  return (
    <Router>
      {allowRegistration && (
        <>
          <Register path="register" />
          <UserFeedback path="feedback/*" />
        </>
      )}
    </Router>
  );
};

export default User;
