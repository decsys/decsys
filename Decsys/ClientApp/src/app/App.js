import React from "react";
import { connect } from "react-redux";
import AppBar from "./components/AppBar";
import { Route, Redirect, Switch, withRouter } from "react-router-dom";
import SurveysScreen from "./screens/admin/SurveysScreen";
import { Container, EmptyState, FlexBox } from "./components/ui";
import { fetchSurveys } from "./state/ducks/surveys";
import { push } from "connected-react-router";
import { CheckCircle } from "styled-icons/fa-solid";

const PureApp = ({ dispatch, listLoaded }) => {
  return (
    <>
      <AppBar brand="DECSYS" />
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
          path="/admin/survey/:id"
          render={() => (
            // TODO: temporary content before editor is ready
            <Container>
              <FlexBox mt={5}>
                <EmptyState
                  splash={<CheckCircle />}
                  message="Your Survey was created! The Editor is not ready yet."
                  callToAction={{
                    label: "Back to Survey List",
                    onClick: () => dispatch(push("/admin"))
                  }}
                />
              </FlexBox>
            </Container>
          )}
        />

        <Route
          render={() => (
            // Any unrecognised frontend route = 404
            <Container>
              <FlexBox mt={5}>
                <EmptyState message="404: Not Found" />
              </FlexBox>
            </Container>
          )}
        />
      </Switch>
    </>
  );
};

const App = withRouter(connect()(PureApp));

export default App;
