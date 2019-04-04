import React from "react";
import { connect } from "react-redux";
import AppBar from "./components/AppBar";
import { Route, Redirect, Switch, withRouter } from "react-router-dom";
import SurveysScreen from "./screens/admin/SurveysScreen";
import { Container, EmptyState, FlexBox } from "./components/ui";
import { fetchSurveys } from "./state/ducks/surveys";
import { getSurvey } from "./state/ducks/editor/ops";
import EditorScreen from "./screens/admin/EditorScreen";
import PreviewScreen from "./screens/admin/PreviewScreen";
import { getUserId } from "./state/ducks/user/ops";
import { getSurveyInstance } from "./state/ducks/survey";
import SurveyScreen from "./screens/survey/SurveyScreen";

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
        path="/survey/:id"
        exact
        render={() => {
          // need instanceId first, which is fine as in future we will need to check access type and such too
          dispatch(getSurveyInstance());
          dispatch(getUserId());
          return <div>Hello World</div>;
        }}
      />

      <Route
        path="/survey"
        exact
        render={() => {
          return;
        }}
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
        path="/admin/survey/:id"
        exact
        render={({ match }) => {
          dispatch(getSurvey(match.params.id));
          return <EditorScreen id={match.params.id} />;
        }}
      />

      <Route
        path="/admin/survey/:id/preview"
        exact
        render={({ match }) => {
          dispatch(getSurvey(match.params.id));
          return <PreviewScreen />;
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
