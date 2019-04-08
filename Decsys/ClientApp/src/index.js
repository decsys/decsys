import * as serviceWorker from "./serviceWorker";
import React from "react";
import ReactDOM from "react-dom";
import { Normalize, ThemeProvider } from "@smooth-ui/core-sc";
import theme from "./app/themes";
import App from "./app/App";
import { loadComponentsModule } from "./global-init";

loadComponentsModule();

// Only actually boostrap the app once components from global-init are confirmed loaded
document.addEventListener("__DECSYS__ComponentsLoaded", () =>
  ReactDOM.render(
    <>
      <Normalize />

      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </>,
    document.getElementById("root")
  )
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
