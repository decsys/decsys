import React from "react";
import { Router, View, NotFoundBoundary } from "react-navi";
import routes from "./routes";
import ErrorScreen from "./screens/ErrorScreen";

const App = () => {
  return (
    <Router routes={routes}>
      <NotFoundBoundary render={() => <ErrorScreen message="404: Not Found" />}>
        <View /> {/* We don't have any real common layout to speak of */}
      </NotFoundBoundary>
    </Router>
  );
};

export default App;
