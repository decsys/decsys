import React, { Component } from "react";
import { Route } from "react-router-dom";
import AppBar from "./partials/AppBar";

class App extends Component {
  render() {
    return (
      <>
        <AppBar />

        <Route path="/" exact render={() => <p>Hello, World!</p>} />
        <Route path="/1" render={() => <p>Page 1</p>} />
        <Route path="/2" render={() => <p>Page 2</p>} />
      </>
    );
  }
}

export default App;
