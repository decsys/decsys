import React, { createContext, useContext, useState, useEffect } from "react";
import { useServerConfig } from "api/config";
import { WORKSHOP } from "constants/app-modes";
import { isWorkshopAdmin, isOidcAdmin } from "./helpers";
import { UserManager, Log } from "oidc-client";
import config from "./config";

//#region User Manager singleton init
Log.logger = console;
export const users = new UserManager(config.oidc);
//#endregion

//#region Static Methods
const login = async () => {
  try {
    await users.signinSilent({ useReplaceToNavigate: true });
  } catch {
    try {
      await users.signinRedirect({
        useReplaceToNavigate: true,
        state: { returnUrl: window.location.href },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};

const logout = () =>
  users.signoutRedirect({
    useReplaceToNavigate: true,
  });
//#endregion

//#region Auth Context
const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const { mode } = useServerConfig();
  const [user, setUser] = useState(mode === WORKSHOP ? {} : null);
  const [isAdmin, setIsAdmin] = useState(
    mode === WORKSHOP ? isWorkshopAdmin : false
  );

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

  // Update `isAdmin`
  useEffect(() => {
    if (mode === WORKSHOP) return;
    setIsAdmin(isOidcAdmin(user));
  }, [user, mode]);

  const value = {
    user,
    isAdmin,
    login,
    logout,
  };

  return <AuthContext.Provider value={value} children={children} />;
};
//#endregion
