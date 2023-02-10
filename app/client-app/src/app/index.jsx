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
import { Error } from "app/pages/Error";
import { ErrorBoundary } from "components/ErrorBoundary";

const App = () => {
  return (
    <AuthContextProvider>
      <LayoutProvider layouts={layouts}>
        <LocalInstancesProvider>
          <ErrorBoundary fallback={<Error message="Something went wrong!" />}>
            <Router>
              <Root path="/" />
              <Admin path="admin/*" />
              <Participant path="/survey/*" />
              <Auth path={`${Paths.Prefix(true)}/*`} />
              <User path={`/user/*`} />
              <Error message="404: Not Found" default />
            </Router>
          </ErrorBoundary>
        </LocalInstancesProvider>
      </LayoutProvider>
    </AuthContextProvider>
  );
};

export default App;
