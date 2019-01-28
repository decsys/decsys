import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Normalize, ThemeProvider, Button } from "@smooth-ui/core-sc";
import theme from "./themes";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <>
    <Normalize />
    <Router>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Router>
  </>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
