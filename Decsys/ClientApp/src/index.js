import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Normalize, ThemeProvider } from "@smooth-ui/core-sc";
import { Provider } from "react-redux";
import { createStore } from "redux";
import theme from "./themes";
import App from "./app/App";
import rootReducer from "./reducers";

import * as serviceWorker from "./serviceWorker";

//import "react-tabulator/lib/css/bootstrap/tabulator_bootstrap4.min.css";

ReactDOM.render(
  <>
    <Normalize />
    <Router>
      <ThemeProvider theme={theme}>
        <Provider
          store={createStore(
            rootReducer,
            window.__REDUX_DEVTOOLS_EXTENSION__ &&
              window.__REDUX_DEVTOOLS_EXTENSION__()
          )}
        >
          <App />
        </Provider>
      </ThemeProvider>
    </Router>
  </>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
