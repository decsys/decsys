import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Normalize, ThemeProvider } from "@smooth-ui/core-sc";
import { Provider } from "react-redux";
import { configureStore } from "redux-starter-kit";
import theme from "./themes";
import App from "./App";
import rootReducer from "./reducers";

import * as serviceWorker from "./serviceWorker";
import { routerMiddleware, ConnectedRouter } from "connected-react-router";
import thunk from "redux-thunk";

const history = createBrowserHistory();

ReactDOM.render(
  <>
    <Normalize />

    <ThemeProvider theme={theme}>
      <Provider
        store={configureStore({
          reducer: rootReducer(history),
          middleware: [routerMiddleware(history), thunk]
        })}
      >
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
