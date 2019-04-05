import React, { Suspense } from "react";
import { Router, View, NotFoundBoundary } from "react-navi";
import routes from "./routes";
import ErrorScreen from "./screens/ErrorScreen";
import { LoadingIndicator } from "./components/ui";

const App = () => {
  return (
    <Router routes={routes}>
      <NotFoundBoundary render={() => <ErrorScreen message="404: Not Found" />}>
        <Suspense fallback={() => <LoadingIndicator />}>
          <View /> {/* We don't have any real common layout to speak of */}
        </Suspense>
      </NotFoundBoundary>
    </Router>
  );
};

export default App;
