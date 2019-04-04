import React, { useState } from "react";
import { UserProvider } from "../../contexts/user";

const User = ({ children, location }) => {
  const [user, setUser] = useState({
    localhost: false,
    user: { roles: {} },
    instances: {}
  });

  const actions = {
    checkLocalAdmin: () => {
      if (window.location.hostname === "localhost") {
        setUser({
          ...user,
          localhost: true,
          user: {
            ...user.user,
            roles: { ...user.user.roles, admin: true }
          }
        });
      } else {
        setUser({
          ...user,
          localhost: false,
          user: {
            ...user.user,
            roles: { ...user.user.roles, admin: false }
          }
        });
      }
    }
  };

  return (
    <UserProvider value={{ ...user, ...actions }}>{children}</UserProvider>
  );
};

export default User;
