import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Surveys from "./surveys/Surveys";

const Admin = props => (
  <Switch>
    <Route
      exact
      path={`${props.match.url}`}
      render={() => <Redirect to={`${props.match.url}/surveys`} />}
    />

    <Route path={`${props.match.url}/surveys`} component={Surveys} />
  </Switch>
);

export default Admin;
