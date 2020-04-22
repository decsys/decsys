import * as serviceWorker from "./serviceWorker";
import React from "react";
import ReactDOM from "react-dom";
import App from "app";
import loadPageResponseComponents from "./global";

import "react-table/react-table.css"; // sad now

// ask the backend to provide the page response components module
loadPageResponseComponents();

// when that module finishes loading it fires an event
// telling us we can bootstrap the ClientApp
document.addEventListener("__DECSYS__ComponentsLoaded", () =>
  ReactDOM.render(<App />, document.getElementById("root"))
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
