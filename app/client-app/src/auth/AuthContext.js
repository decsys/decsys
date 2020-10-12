import React, { createContext, useContext, useState, useEffect } from "react";
import { useServerConfig } from "api/config";
import { WORKSHOP } from "constants/app-modes";
import * as helpers from "./helpers";
import { UserManager, Log } from "oidc-client";
import config from "./config";

const { isWorkshopAdmin, isOidcAdmin } = helpers;

//#region User Manager singleton init
// Log.logger = console; // TODO: useful for debugging ;)
export const users = new UserManager(config.oidc);
//#endregion

//#region Static Methods

/**
 * @typedef {object} LoginOptions
 * @property {string} [options.returnUrl]
 * Specify a custom URL to go to after the login completes.
 * - nullish will try and return to the route that requested the login
 * - Use an empty string (`""`) to return to the homepage
 */
/** @param {LoginOptions} [param] */
const login = async ({ returnUrl } = {}) => {
  try {
    await users.signinSilent({ useReplaceToNavigate: true });
  } catch {
    try {
      await users.signinRedirect({
        useReplaceToNavigate: true,
        state: { returnUrl: returnUrl ?? window.location.href },
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
const AuthContext = createContext({
  user: null,
  isAdmin: false,
  login,
  logout,
});
export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const { mode } = useServerConfig();
  const [user, setUser] = useState(mode === WORKSHOP ? {} : null);
  const [isAdmin, setIsAdmin] = useState(
    mode === WORKSHOP ? isWorkshopAdmin : false
  );
  const [isSuperUser, setIsSuperUser] = useState(
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

  // Update computed user state
  useEffect(() => {
    if (mode === WORKSHOP) return;
    setIsAdmin(isOidcAdmin(user));
    setIsSuperUser(helpers.isSuperUser(user));
  }, [user, mode]);

  const value = {
    user,
    isAdmin,
    isSuperUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value} children={children} />;
};
//#endregion
