import { navigate } from "@reach/router";
import { useAuth } from "auth/AuthContext";
import { LoadingIndicator } from "components/core";

const Root = () => {
  const { user, isAdmin } = useAuth();
  if (user === undefined) {
    return <LoadingIndicator verb="Checking" noun="user" />;
  } else {
    if (isAdmin) navigate("/admin");
    else navigate("/survey");
    return null;
  }
};

export default Root;
