import React, { Suspense, useState, useEffect } from "react";
import { Router, View, NotFoundBoundary } from "react-navi";
import routes from "./routes";
import ErrorScreen from "./screens/ErrorScreen";
import { LoadingIndicator } from "./components/ui";
import * as users from "./services/user";

const App = () => {
  let [user, setUser] = useState(() => users.get());

  useEffect(() => users.subscribe(setUser), []);

  return (
    <Router routes={routes} context={{ users, user }}>
      <NotFoundBoundary render={() => <ErrorScreen message="404: Not Found" />}>
        <Suspense fallback={<LoadingIndicator />}>
          <View /> {/* We don't have any real common layout to speak of */}
        </Suspense>
      </NotFoundBoundary>
    </Router>
  );
};

export default App;
