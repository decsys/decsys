import React, { useState } from "react";
import { Router } from "@reach/router";
import Root from "./routes/root";
import UsersContextProvider from "contexts/UsersContext";
import Admin from "./routes/admin.routes";
import { LayoutProvider } from "components/core/LayoutPage";
import layouts from "./layouts";
import Participant from "./routes/participant.routes";
import Auth from "./routes/auth.routes";
import { Paths } from "auth/constants";
import { UserManager } from "oidc-client";
import axios from "axios";
import config from "auth/config";
import { Button, Stack } from "@chakra-ui/core";

const ErrorPage = React.lazy(() => import("app/pages/Error"));

const users = new UserManager(config.oidc);

// AUTH test routes
const Test = () => {
  const [logContent, setLogContent] = useState();

  const log = (...args) => {
    setLogContent(
      args
        .map((msg) => {
          if (msg instanceof Error) {
            return "Error: " + msg.message;
          } else if (typeof msg !== "string") {
            return JSON.stringify(msg, null, 2);
          }
          return msg;
        })
        .join("\r\n")
    );
  };

  users.getUser().then((user) => {
    if (user) {
      log("User logged in", user.profile);
    } else {
      log("User not logged in");
    }
  });

  const handleLoginClick = () => users.signinRedirect();
  const handleLogoutClick = () => users.signoutRedirect();
  const handleApiCallClick = async () => {
    const user = await users.getUser();
    const { data } = await axios.get("/api/surveys", {
      headers: { Authorization: `Bearer ${user.access_token}` },
    });
    log(data);
  };

  return (
    <Stack>
      <Button onClick={handleLoginClick}>Login</Button>
      <Button onClick={handleApiCallClick}>Call API</Button>
      <Button onClick={handleLogoutClick}>Logout</Button>

      <pre>{logContent}</pre>
    </Stack>
  );
};

const App = () => (
  <UsersContextProvider>
    <LayoutProvider layouts={layouts}>
      <Router>
        {/* <Root path="/" /> */}
        <Test path="/" />
        <Admin path="admin/*" />
        <Participant path="/survey/*" />
        <Auth path={`${Paths.Prefix(true)}/*`} />
        <ErrorPage message="404: Not Found" default />
      </Router>
    </LayoutProvider>
  </UsersContextProvider>
);

export default App;
