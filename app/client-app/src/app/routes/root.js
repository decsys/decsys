import { redirectTo } from "@reach/router";
import { useUsers } from "contexts/UsersContext";

const Root = () => {
  const { user } = useUsers();
  user.roles.admin ? redirectTo("/admin") : redirectTo("/survey");
  return null;
};

export default Root;
