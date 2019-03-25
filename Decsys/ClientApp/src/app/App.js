import React from "react";
import { connect } from "react-redux";
import AppBar from "./components/AppBar";
import { Route, Redirect, Switch, withRouter } from "react-router-dom";
import SurveysScreen from "./screens/admin/SurveysScreen";
import { Container, EmptyState, FlexBox } from "./components/ui";
import { fetchSurveys } from "./state/ducks/surveys";
import { getSurvey } from "./state/ducks/editor/ops";
import EditorScreen from "./screens/admin/EditorScreen";
import { Grid, Cell } from "styled-css-grid";

const PureApp = ({ dispatch }) => {
  return (
    <Switch>
      <Route
        path="/"
        exact
        render={() => (
          // TODO: conditional logic for admin
          <Redirect to="/admin" />
        )}
      />

      <Route
        path="/admin"
        exact
        render={() => {
          dispatch(fetchSurveys());
          return <SurveysScreen />;
        }}
      />

      <Route
        path="/component-test"
        exact
        render={() => {
          const Component = window.__DECSYS__.Components.FreeText;
          return (
            <>
              <AppBar brand="DECSYS" />
              <Component />
            </>
          );
        }}
      />

      <Route
        path="/admin/survey/:id"
        exact
        render={({ match }) => {
          dispatch(getSurvey(match.params.id));
          return <EditorScreen id={match.params.id} />;
        }}
      />

      <Route
        render={() => (
          // Any unrecognised frontend route = 404
          <>
            <AppBar brand="DECSYS" />
            <Container>
              <FlexBox mt={5}>
                <EmptyState message="404: Not Found" />
              </FlexBox>
            </Container>
          </>
        )}
      />
    </Switch>
  );
};

const App = withRouter(connect()(PureApp));

export default App;
