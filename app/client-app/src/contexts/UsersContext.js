import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import produce from "immer";

const UsersContext = createContext({
  user: {},
  users: {
    storeInstanceParticipantId: () => {},
    clearInstanceParticipantId: () => {},
  },
});
export const useUsers = () => useContext(UsersContext);

const UsersContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    roles: { admin: window.location.hostname === "localhost" },
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
    user,
    users: { storeInstanceParticipantId, clearInstanceParticipantId },
  };

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
};

export default UsersContextProvider;
