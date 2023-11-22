import { Router } from "@reach/router";
import { Error } from "app/pages/Error";
import Surveys from "app/pages/Surveys";
import Editor from "app/pages/Editor";
import Results from "app/pages/Results";
import Dashboard from "app/pages/Dashboard";
import Wordlist from "app/pages/Wordlist";
import { useAuth } from "auth/AuthContext";
import { BusyPage } from "components/core";
import Preview from "app/pages/Preview";

const Admin = () => {
  const { isAdmin, user, login } = useAuth();

  if (!user) {
    if (user === null) login();
    return <BusyPage verb="Checking" noun="user" />;
  }

  if (!isAdmin) return <Error message="403: Forbidden" default />;

  return (
    <Router>
      <Surveys path="/" />
      <Wordlist path="/wordlist" />
      <Editor path="/survey/:id" />
      <Preview path="/survey/:id/preview" />
      <Results path="/survey/:id/results" />
      <Dashboard path="/survey/dashboard/:combinedId" />
      <Error message="404: Not Found" default />
    </Router>
  );
};

export default Admin;
