import { Suspense, StrictMode } from "react";
import ReactDOM from "react-dom";
import { NakedErrorBoundary } from "components/ErrorBoundary";
import { ErrorBody } from "app/pages/Error";
import App from "app";
import LoadingIndicator from "components/core/LoadingIndicator";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "themes";
import { Router } from "@reach/router";

const root = document.getElementById("root");
ReactDOM.render(<LoadingIndicator />, root);

// asynchronously ask the backend to provide the page response components module
import("./global").then((g) => g.loadPageResponseComponents());

// when that module finishes loading it fires an event
// telling us we can bootstrap the full ClientApp
// TODO: don't make this dependent on the event firing
// instead have components that need DECSYS components suspend on them
document.addEventListener("__DECSYS__ComponentsLoaded", () =>
  ReactDOM.render(
    <StrictMode>
      <ChakraProvider
        resetCSS
        portalZIndex={theme.zIndices.portal}
        theme={theme}
      >
        <NakedErrorBoundary
          fallback={<ErrorBody message="Something went wrong!" />}
        >
          <Suspense fallback={<LoadingIndicator />}>
            {/* This Router is used hilariously to initialise LocationProvider earlier than it would otherwise */}
            <Router>
              <App default />
            </Router>
          </Suspense>
        </NakedErrorBoundary>
      </ChakraProvider>
    </StrictMode>,
    root
  )
);
