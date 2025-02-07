import { Router } from "@reach/router";
import { Error } from "app/pages/Error";
import Surveys from "app/pages/Surveys";
import Editor from "app/pages/Editor";
import Preview from "app/pages/Preview";
import Results from "app/pages/Results";
import Dashboard from "app/pages/Dashboard";
import Wordlist from "app/pages/Wordlist";
import { useAuth } from "auth/AuthContext";
import { BusyPage } from "components/core";
import Wordlists from "app/pages/Wordlists";
import DefaultWordlist from "app/pages/Wordlist/DefaultWordlist";
import Folders from "app/pages/Folders";

const Admin = () => {
  const { isAdmin, user, login } = useAuth();

  if (!user) {
    if (user === null) login();
    return <BusyPage verb="Checking" noun="user" />;
  }

  if (!isAdmin) return <Error message="403: Forbidden" default />;

  return (
    <Router>
      <Surveys path="/surveys" />
      <Wordlist path="/wordlists/:id" />
      <Wordlists path="/wordlists" />
      <DefaultWordlist path="/wordlists/defaultWordlist" />
      <Editor path="/surveys/:id" />
      <Preview path="/surveys/:id/preview" />
      <Results path="/surveys/:id/results" />
      <Dashboard path="/surveys/dashboard/:combinedId" />
      <Folders path="/folders/:name" />
      <Error message="404: Not Found" default />
    </Router>
  );
};

export default Admin;
