import { Router } from "@reach/router";
import { Paths } from "auth/constants";
import Login from "app/pages/Login/Login";
import CompleteSignIn from "./auth-callbacks/CompleteSignIn";
import { Error } from "app/pages/Error";

const Auth = () => (
  <Router>
    <Login path={Paths.LoginForm()} />
    <CompleteSignIn path={Paths.CompleteSignIn()} />
    <Error message="404: Not Found" default />
  </Router>
);

export default Auth;
