import React, { Component } from "react";
import AppBar from "./components/AppBar";
import { Route, Redirect, Switch } from "react-router-dom";
import SurveysScreen from "./screens/admin/SurveysScreen";
import { Container, EmptyState, FlexBox } from "./components/ui";
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

class App extends Component {
  render() {
    return (
      <>
        <AppBar brand="DECSYS" />
        <Switch>
          <Route path="/" exact render={() => <Redirect to="/admin" />} />

          <Route path="/admin" component={SurveysScreen} />

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
  }
}
// return (
//   <>
//     <AppBar brand="DECSYS" />
// <AppBarLink to="/about">About</AppBarLink>

//     <Switch>
//       <Route path="/" exact component={IndexRouter} />
//       <Route path="/admin" component={Admin} />

//       <Route render={() => <h1>404</h1>} />
//     </Switch>
//   </>
// );

export default App;
