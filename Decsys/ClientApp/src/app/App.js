import React, { StrictMode, Suspense, useState, useEffect } from "react";
import BusyIndicator from "react-busy-indicator";
import { Router, View, NotFoundBoundary, useLoadingRoute } from "react-navi";
import routes from "./routes";
import ErrorScreen from "./screens/ErrorScreen";
import { LoadingIndicator } from "./components/ui";
import * as users from "./services/user";

const App = () => {
  const loadingRoute = useLoadingRoute();

  const [user, setUser] = useState(() => users.get());
  useEffect(() => users.subscribe(setUser), []);

  return (
    <StrictMode>
      <Router routes={routes} context={{ users, user }}>
        <NotFoundBoundary
          render={() => <ErrorScreen message="404: Not Found" />}
        >
          <BusyIndicator isBusy={!!loadingRoute} delayMs={200} />
          <Suspense fallback={<LoadingIndicator />}>
            <View />
          </Suspense>
        </NotFoundBoundary>
      </Router>
    </StrictMode>
  );
};

export default App;
