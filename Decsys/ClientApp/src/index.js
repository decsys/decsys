import * as serviceWorker from "./serviceWorker";
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Normalize, ThemeProvider } from "@smooth-ui/core-sc";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import theme from "./app/themes";
import App from "./app/App";
import configureStore from "./app/state/store";

/**
 * Load dynamic DECSYS Components
 */

window.__DECSYS__ = {}; // Register our global namespace at bootstrap time
// React and styled need to stay as single instances, so we make them global for modules
// also PropTypes for now because I don't understand rollup well enough
window.React = React;
window.styled = styled;
window.PropTypes = PropTypes;

// fetch DECSYS Component modules from the API and chuck them on the page
// We get the App to do this so we can be sure our bundle is already loaded
// including Component dependencies such as React, styled etc...
const script = document.createElement("script");
script.src = "/api/components";
script.type = "module";
document.body.appendChild(script);

/**
 * Bootstrap the React app itself
 */

const history = createBrowserHistory();

// Only actually boostrap the app once components are confirmed loaded
document.addEventListener("__DECSYS__ComponentsLoaded", () =>
  ReactDOM.render(
    <>
      <Normalize />

      <ThemeProvider theme={theme}>
        <Provider store={configureStore(history)}>
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        </Provider>
      </ThemeProvider>
    </>,
    document.getElementById("root")
  )
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
