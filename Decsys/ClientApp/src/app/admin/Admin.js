import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Surveys from "./surveys/Surveys";
import Survey from "./survey/Survey";

const Admin = props => (
  <Switch>
    <Route
      exact
      path={`${props.match.url}`}
      render={() => <Redirect to={`${props.match.url}/surveys`} />}
    />

    <Route path={`${props.match.url}/surveys`} component={Surveys} />

    <Route path={`${props.match.url}/survey/:id`} component={Survey} />
  </Switch>
);

export default Admin;
