import { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import AppWrapper from "./AppWrapper";
import Loading from "app/pages/Loading";
import ErrorBoundary from "components/ErrorBoundary";
import Error from "app/pages/Error";
import { LoadingIndicator } from "components/core";

const root = document.getElementById("root");

// render our lightweight loading shell
// for "fast" first paint
ReactDOM.render(
  <AppWrapper>
    <Suspense fallback={<LoadingIndicator />}>
      <Loading />
    </Suspense>
  </AppWrapper>,
  root
);

// asynchronously ask the backend to provide the page response components module
import("./global").then((g) => g.loadPageResponseComponents());

// load the full app on demand
const App = lazy(() => import("app"));

// when that module finishes loading it fires an event
// telling us we can bootstrap the full ClientApp
// TODO: don't make this dependent on the event firing
// instead have components that need DECSYS components suspend on them
document.addEventListener("__DECSYS__ComponentsLoaded", () =>
  ReactDOM.render(
    <AppWrapper>
      <ErrorBoundary fallback={<Error message="Something went wrong!" />}>
        <Suspense fallback={<Loading />}>
          <App />
        </Suspense>
      </ErrorBoundary>
    </AppWrapper>,
    root
  )
);
