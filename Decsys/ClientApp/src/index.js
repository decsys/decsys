import * as serviceWorker from "./serviceWorker";
import React from "react";
import styled, { css } from "styled-components";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { createBrowserHistory } from "history";
import { Normalize, ThemeProvider } from "@smooth-ui/core-sc";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import theme from "./app/themes";
import App from "./app/App";
import User from "./app/components/User";
import configureStore from "./app/state/store";

/**
 * Load dynamic DECSYS Components
 */

window.__DECSYS__ = {}; // Register our global namespace at bootstrap time

// React, ReactDOM and styled need to stay as single instances, so we make them global for modules
// Do the same with PropTypes to make components smaller - they'll all be using it and we have it
// so why make them bundle it everytime?
window.React = React;
window.ReactDOM = ReactDOM;
window.PropTypes = PropTypes;
// TODO: we should put param-types here - all DECSYS components will use it, save them all bundling it

// Styled doesn't put all its named exports on the default :(
// So I guess that job is on us until we have a better way to do this than globals
styled.css = css;
window.styled = styled;

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
          <User>
            <ConnectedRouter history={history}>
              <App />
            </ConnectedRouter>
          </User>
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
