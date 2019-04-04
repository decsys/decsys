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
import SurveyScreen from "./screens/survey/SurveyScreen";
import { UserConsumer } from "./contexts/user";

const PureApp = ({ dispatch }) => {
  return (
    <Switch>
      <Route
        path="/"
        exact
        render={() => (
          <UserConsumer>
            {({ user, checkLocalAdmin }) => {
              checkLocalAdmin();

              if (user.roles.admin) return <Redirect to="/admin" />;
              else return <Redirect to="/401" />;
            }}
          </UserConsumer>
        )}
      />

      <Route
        path="/survey/:id"
        exact
        render={({ match }) => {
          return <SurveyScreen instanceId={match.params.id} />;
        }}
      />

      <Route
        path="/survey/:id/page/:page"
        exact
        render={({ match }) => {
          return (
            <SurveyScreen
              instanceId={match.params.id}
              page={match.params.page}
            />
          );
        }}
      />

      <Route
        path="/survey"
        exact
        render={() => {
          return; // TODO: enter id page
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
