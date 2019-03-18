import React, { Component } from "react";
// import { Route, Redirect, Switch } from "react-router-dom";
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
    return <div>Hello World</div>;
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
  }
}

export default App;
