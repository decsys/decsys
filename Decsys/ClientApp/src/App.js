import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { Grid } from "@smooth-ui/core-sc";
import AppBar from "./partials/AppBar";
import Admin from "./partials/Admin/Admin";
import Survey from "./partials/Survey";

const IndexRouter = props => {
  // TODO: Add first time check for creating an admin account?

  // TODO: One day there will be a dashboard at `/`

  return window.location.hostname === "localhost" ? (
    <Redirect to="/admin" />
  ) : (
    <Survey />
  );
};

class App extends Component {
  render() {
    return (
      <>
        <AppBar />

        <Grid>
          <Switch>
            <Route path="/" exact component={IndexRouter} />
            <Route path="/admin" component={Admin} />

            <Route render={() => <h1>404</h1>} />
          </Switch>
        </Grid>
      </>
    );
  }
}

export default App;
