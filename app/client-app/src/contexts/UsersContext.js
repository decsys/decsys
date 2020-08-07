import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import produce from "immer";
import { useDecsysAppMode } from "api/config";
import { WORKSHOP } from "constants/app-modes";

const UsersContext = createContext({
  mode: WORKSHOP,
  user: {},
  users: {
    storeInstanceParticipantId: () => {},
    clearInstanceParticipantId: () => {},
  },
});
export const useUsers = () => useContext(UsersContext);

const UsersContextProvider = ({ children }) => {
  const { data: mode } = useDecsysAppMode();
  const [user, setUser] = useState({
    roles: {
      admin: mode === WORKSHOP && window.location.hostname === "localhost",
    },
    instances: JSON.parse(localStorage.getItem("instances")) || {},
  });

  const storeInstanceParticipantId = (
    combinedSurveyInstanceId,
    participantId
  ) => {
    setUser(
      produce((u) => {
        u.instances[combinedSurveyInstanceId] = participantId;
      })
    );
  };

  const clearInstanceParticipantId = (combinedSurveyInstanceId) =>
    storeInstanceParticipantId(combinedSurveyInstanceId, null);

  useEffect(() => {
    localStorage.setItem("instances", JSON.stringify(user.instances));
  }, [user.instances]);

  const value = {
    mode,
    user,
    users: { storeInstanceParticipantId, clearInstanceParticipantId },
  };

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
};

export default UsersContextProvider;
