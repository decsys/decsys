import React, { StrictMode, Suspense, useState, useEffect } from "react";
import BusyIndicator from "react-busy-indicator";
// import { Router, View, NotFoundBoundary, useLoadingRoute } from "react-navi";
import { Normalize, ThemeProvider } from "@smooth-ui/core-sc";
import theme from "themes";
import routes from "./routes";
import ErrorScreen from "./screens/ErrorScreen";
import { LoadingIndicator } from "components/core";
import * as users from "services/user";

const App = () => {
  //const loadingRoute = useLoadingRoute();

  const [user, setUser] = useState(() => users.get());
  useEffect(() => users.subscribe(setUser), []);

  return (
    <>
      <ErrorScreen />

      {/* NAVI version
        <Router routes={routes} context={{ users, user }}>
          <NotFoundBoundary
            render={() => <ErrorScreen message="404: Not Found" />}
          >
            <BusyIndicator isBusy={!!loadingRoute} delayMs={200} />
            <Suspense fallback={<LoadingIndicator />}>
              <View />
            </Suspense>
          </NotFoundBoundary>
        </Router> */}
    </>
  );
};

export default App;
