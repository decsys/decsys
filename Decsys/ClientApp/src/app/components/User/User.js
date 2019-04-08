import React, { useState, useEffect } from "react";
import UserContext from "../../contexts/user";

const User = ({ children }) => {
  const [user, setUser] = useState({
    localhost: false,
    user: { roles: {} },
    instances: {}
  });

  useEffect(() => {
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
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default User;
