import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import produce from "immer";
import { useServerConfig } from "api/config";
import { WORKSHOP } from "constants/app-modes";
import { UserManager, Log } from "oidc-client";
import config from "auth/config";
import { ClaimTypes, Roles } from "auth/constants";

// TODO: debug flag this?
Log.logger = console;

export const users = new UserManager(config.oidc);
users.events.addUserSignedOut(async () => {
  await users.removeUser();
});
// TODO: events to update context state?

const UsersContext = createContext({
  mode: WORKSHOP,
  users,
  isAdmin: async (user) => {},
  storeInstanceParticipantId: (combinedSurveyInstanceId, participantId) => {},
  clearInstanceParticipantId: (combinedSurveyInstanceId) => {},
  instances: [],
});
export const useUsers = () => useContext(UsersContext);

const UsersContextProvider = ({ children }) => {
  const { mode } = useServerConfig();
  const [instances, setInstances] = useState(
    JSON.parse(localStorage.getItem("instances")) || {}
  );

  const storeInstanceParticipantId = (
    combinedSurveyInstanceId,
    participantId
  ) => {
    setInstances(
      produce((instances) => {
        instances[combinedSurveyInstanceId] = participantId;
      })
    );
  };

  const clearInstanceParticipantId = (combinedSurveyInstanceId) =>
    storeInstanceParticipantId(combinedSurveyInstanceId, null);

  const isAdmin = async (user) => {
    if (mode === WORKSHOP) return window.location.hostname === "localhost";
    if (!user) user = await users.getUser();

    const { profile: { [ClaimTypes.Role]: roles } = {} } = user;
    if (!roles) return false;
    if (typeof roles === "string") return roles === Roles.SurveyAdmin;
    return roles.includes(Roles.SurveyAdmin);
  };

  useEffect(() => {
    localStorage.setItem("instances", JSON.stringify(instances));
  }, [instances]);

  const value = {
    mode,
    isAdmin,
    storeInstanceParticipantId,
    clearInstanceParticipantId,
    instances,
    users,
    unauthorized_uri: config.unauthorized_uri,
  };

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
};

export default UsersContextProvider;
