import React from "react";
import { connect } from "react-redux";
import AppBar from "./components/AppBar";
import { Route, Redirect, Switch } from "react-router-dom";
import SurveysScreen from "./screens/admin/SurveysScreen";
import { Container, EmptyState, FlexBox } from "./components/ui";
import { fetchSurveys } from "./state/ducks/surveys";
// import AppBar from "./app/AppBar";
// import Admin from "./app/admin/Admin";
// import Survey from "./app/survey/Survey";

// const IndexRouter = props => {
//   // TODO: Add first time check for creating an admin account?

//   // TODO: One day there will be a dashboard at `/`

//   return window.location.hostname === "localhost" ? (
//     <Redirect to="/admin" />
//   ) : (
//     <Survey />
//   );
// };

/*<Route exact path="/home" render={() => (
  isLoggedIn() ? (
    <Redirect to="/front"/>
  ) : (
    <Home />
  )
)}/>*/

const PureApp = ({ dispatch, listLoaded }) => {
  return (
    <>
      <AppBar brand="DECSYS" />
      <Switch>
        <Route path="/" exact render={() => <Redirect to="/admin" />} />

        <Route
          path="/admin"
          render={() => {
            dispatch(fetchSurveys());
            return <SurveysScreen />;
          }}
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

const App = connect(state => ({ listLoaded: state.surveys.listLoaded }))(
  PureApp
);

export default App;
