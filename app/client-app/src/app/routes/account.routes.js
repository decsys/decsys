import React from "react";
import { Router } from "@reach/router";
import Register from "app/pages/Register/Register";

const Account = () => (
  <Router>
    <Register path="register" />
  </Router>
);

export default Account;
