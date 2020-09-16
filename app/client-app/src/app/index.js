import React from "react";
import { Router } from "@reach/router";
import Root from "./routes/root";
import UsersContextProvider from "auth/UsersContext";
import Admin from "./routes/admin.routes";
import { LayoutProvider } from "components/core/LayoutPage";
import layouts from "./layouts";
import Participant from "./routes/participant.routes";
import Auth from "./routes/auth.routes";
import User from "./routes/user.routes";
import { Paths } from "auth/constants";

const ErrorPage = React.lazy(() => import("app/pages/Error"));

const AuthTest = () => {
  return <div>TODO</div>;
};

const App = () => (
  <UsersContextProvider>
    <LayoutProvider layouts={layouts}>
      <Router>
        <AuthTest path="/" />
        <Admin path="admin/*" />
        <Participant path="/survey/*" />
        <Auth path={`${Paths.Prefix(true)}/*`} />
        <User path={`/user/*`} />
        <ErrorPage message="404: Not Found" default />
      </Router>
    </LayoutProvider>
  </UsersContextProvider>
);

export default App;
