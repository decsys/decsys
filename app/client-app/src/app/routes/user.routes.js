import React from "react";
import { Router } from "@reach/router";
import Register from "app/pages/Register/Register";
import Registered from "app/pages/Register/Registered";
import { useServerConfig } from "api/config";

const User = () => {
  const { allowRegistration } = useServerConfig();
  return (
    <Router>
      {allowRegistration && (
        <>
          <Register path="register" />
          <Registered path="registered" />
        </>
      )}
    </Router>
  );
};

export default User;
