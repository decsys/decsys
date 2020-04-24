import "react-table/react-table.css";

import React, { Suspense } from "react";
import ReactDOM from "react-dom";

import AppWrapper from "./AppWrapper";
import LoadingScreen from "app/screens/LoadingScreen";

const root = document.getElementById("root");

// render our lightweight loading shell
// for fast first paint
ReactDOM.render(
  <AppWrapper>
    <LoadingScreen />
  </AppWrapper>,
  root
);

// asynchronously ask the backend to provide the page response components module
import("./global").then(g => g.loadPageResponseComponents());

// load the full app on demand
const App = React.lazy(() => import("app"));

// when that module finishes loading it fires an event
// telling us we can bootstrap the full ClientApp
// TODO: don't make this dependent on the event firing
// instead have components that need DECSYS components suspend on them
document.addEventListener("__DECSYS__ComponentsLoaded", () =>
  ReactDOM.render(
    <AppWrapper>
      <Suspense fallback={<LoadingScreen noun="app" />}>
        <App />
      </Suspense>
    </AppWrapper>,
    root
  )
);
