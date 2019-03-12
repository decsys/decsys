import * as serviceWorker from "./serviceWorker";
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Normalize, ThemeProvider } from "@smooth-ui/core-sc";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import theme from "./app/themes";
import App from "./app/App";
import configureStore from "./app/state/store";

const history = createBrowserHistory();

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
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
