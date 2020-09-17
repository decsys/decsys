import React, { createContext, useContext, useState, useEffect } from "react";
import { useServerConfig } from "api/config";
import { WORKSHOP } from "constants/app-modes";
import { isWorkshopAdmin, isOidcAdmin } from "./helpers";
import { UserManager, Log } from "oidc-client";
import config from "./config";

// User Manager
Log.logger = console;
export const users = new UserManager(config.oidc);

// Auth Context
const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const { mode } = useServerConfig();
  const [user, setUser] = useState(mode === WORKSHOP ? {} : null);
  const [isAdmin, setIsAdmin] = useState(
    mode === WORKSHOP ? isWorkshopAdmin : false
  );

  useEffect(() => {
    if (mode === WORKSHOP) return;
    setIsAdmin(isOidcAdmin(user));
  }, [user, mode]);

  // Init the context
  useEffect(() => {
    if (mode === WORKSHOP) return;

    // handlers
    const onUserLoaded = (user) => {
      setUser(user);
    };

    // add events
    users.events.addUserLoaded(onUserLoaded);

    // try a silent Signin, but don't stress if it fails
    // this will generate User if there is one
    // and update User due to the userLoaded event firing
    (async () => {
      try {
        await users.signinSilent({ useReplaceToNavigate: true }); // this works but is slow
      } catch (e) {
        // login_required is fine, we won't go on to login until a user requests it
        if (e.error !== "login_required") throw e;
      }
    })();

    // clean up
    return () => {
      users.events.removeUserLoaded(onUserLoaded);
    };
  }, [mode]);

  const value = {
    user,
    isAdmin,
    login: async () => {
      try {
        await users.signinSilent({ useReplaceToNavigate: true });
      } catch {
        try {
          // TODO: returnUrl
          await users.signinRedirect({ useReplaceToNavigate: true });
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    },
    logout: () => {
      users.signoutRedirect({ useReplaceToNavigate: true });
    },
  };

  return <AuthContext.Provider value={value} children={children} />;
};
