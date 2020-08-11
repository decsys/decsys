import React, { useState, useEffect, useCallback } from "react";
import { Router, navigate } from "@reach/router";
import Root from "./routes/root";
import UsersContextProvider, { useUsers } from "contexts/UsersContext";
import Admin from "./routes/admin.routes";
import { LayoutProvider } from "components/core/LayoutPage";
import layouts from "./layouts";
import Participant from "./routes/participant.routes";
import Auth from "./routes/auth.routes";
import { Paths } from "auth/constants";
import axios from "axios";
import { Button, Stack } from "@chakra-ui/core";

const ErrorPage = React.lazy(() => import("app/pages/Error"));

// AUTH test routes
const Test = () => {
  const { users, isAdmin } = useUsers();
  const [logContent, setLogContent] = useState();
  const [adminStatus, setAdminStatus] = useState(false);

  const log = useCallback((...args) => {
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
  }, []);

  useEffect(() => {
    (async () => {
      const user = await users.getUser();
      if (user) {
        log("User logged in", user.profile);
      } else {
        log("User not logged in");
      }
    })();
  }, [users, log]);

  useEffect(() => {
    (async () => setAdminStatus(await isAdmin()))();
  }, [isAdmin]);

  const handleLoginClick = () => navigate("/auth/request-signin");
  const handleLogoutClick = () => navigate("/auth/request-signout");
  const handleApiCallClick = async () => {
    const user = await users.getUser();
    const { data } = await axios.get("/api/surveys", {
      headers: { Authorization: `Bearer ${user?.access_token}` },
    });
    log(data);
  };

  return (
    <Stack>
      <Button onClick={handleLoginClick}>Login</Button>
      <Button onClick={handleApiCallClick}>Call API</Button>
      <Button onClick={handleLogoutClick}>Logout</Button>

      <ul>
        <li>{JSON.stringify(adminStatus)}</li>
      </ul>
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
