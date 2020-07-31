import React from "react";
import { Router } from "@reach/router";
import Root from "./routes/root";
import UsersContextProvider from "contexts/UsersContext";
import Admin from "./routes/admin.routes";
import { LayoutProvider } from "components/core/LayoutPage";
import layouts from "./layouts";
import Participant from "./routes/participant.routes";

const Error = React.lazy(() => import("app/pages/Error"));

const App = () => (
  <UsersContextProvider>
    <LayoutProvider layouts={layouts}>
      <Router>
        <Root path="/" />
        <Admin path="admin/*" />
        <Participant path="/survey/*" />
        <Error message="404: Not Found" default />
      </Router>
    </LayoutProvider>
  </UsersContextProvider>
);

export default App;
