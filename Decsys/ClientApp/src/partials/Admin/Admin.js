import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import SurveyList from "./SurveyList";

const Admin = props => (
  <Switch>
    <Route
      exact
      path={`${props.match.url}`}
      render={() => <Redirect to={`${props.match.url}/surveys`} />}
    />

    <Route path={`${props.match.url}/surveys`} component={SurveyList} />
  </Switch>
);

export default Admin;
