import { Suspense, StrictMode } from "react";
import ReactDOM from "react-dom";
import ErrorBoundary from "components/ErrorBoundary";
import Error from "app/pages/Error";
import App from "app";
import LoadingIndicator from "components/core/LoadingIndicator";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "themes";

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
        <ErrorBoundary fallback={<Error message="Something went wrong!" />}>
          <Suspense fallback={<LoadingIndicator />}>
            <App />
          </Suspense>
        </ErrorBoundary>
      </ChakraProvider>
    </StrictMode>,
    root
  )
);
