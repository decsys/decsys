import { navigate } from "@reach/router";
import { useAuth } from "auth/AuthContext";
import { BusyPage } from "components/core";

const Root = () => {
  const { user, isAdmin } = useAuth();
  if (user === undefined) {
    return <BusyPage verb="Checking" noun="user" />;
  } else {
    if (isAdmin) navigate("/admin/");
    else navigate("/survey");
    return null;
  }
};

export default Root;
