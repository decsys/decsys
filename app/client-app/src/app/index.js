import React from "react";
import { Router } from "@reach/router";
import Root from "./routes/root";
import Admin from "./routes/admin.routes";
import { LayoutProvider } from "components/core/LayoutPage";
import layouts from "./layouts";
import Participant from "./routes/participant.routes";
import Auth from "./routes/auth.routes";
import User from "./routes/user.routes";
import { Paths } from "auth/constants";
import { AuthContextProvider } from "auth/AuthContext";
import { LocalInstancesProvider } from "./contexts/LocalInstances";

const ErrorPage = React.lazy(() => import("app/pages/Error"));

const App = () => (
  <AuthContextProvider>
    <LayoutProvider layouts={layouts}>
      <LocalInstancesProvider>
        <Router>
          <Root path="/" />
          <Admin path="admin/*" />
          <Participant path="/survey/*" />
          <Auth path={`${Paths.Prefix(true)}/*`} />
          <User path={`/user/*`} />
          <ErrorPage message="404: Not Found" default />
        </Router>
      </LocalInstancesProvider>
    </LayoutProvider>
  </AuthContextProvider>
);

export default App;
