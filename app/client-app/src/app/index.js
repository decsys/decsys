import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import Root from "./routes/root";
import * as users from "services/user";
import UsersContext from "contexts/UsersContext";
import Admin from "./routes/admin.routes";
import { LayoutProvider } from "components/core/LayoutPage";
import layouts from "./layouts";

const Error = React.lazy(() => import("app/pages/Error"));

const App = () => {
  const [user, setUser] = useState(() => users.get());
  useEffect(() => users.subscribe(setUser), []);

  return (
    <UsersContext value={{ users, user }}>
      <LayoutProvider layouts={layouts}>
        <Router>
          <Root path="/" />
          <Admin path="admin/*" />
          <Error message="Survey" path="survey/*" />
          <Error message="404: Not Found" default />
        </Router>
      </LayoutProvider>
    </UsersContext>
  );
};

export default App;
