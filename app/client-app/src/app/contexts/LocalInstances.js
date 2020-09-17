import React, { createContext, useContext, useEffect, useState } from "react";
import produce from "immer";

const LocalInstancesContext = createContext({
  storeInstanceParticipantId: (combinedSurveyInstanceId, participantId) => {},
  clearInstanceParticipantId: (combinedSurveyInstanceId) => {},
  instances: [],
});

export const useLocalInstances = () => useContext(LocalInstancesContext);

export const LocalInstancesProvider = ({ children }) => {
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

  // whenever we update our local state, sync with `localStorage`
  useEffect(() => {
    localStorage.setItem("instances", JSON.stringify(instances));
  }, [instances]);

  const value = {
    storeInstanceParticipantId,
    clearInstanceParticipantId,
    instances,
  };

  return <LocalInstancesContext.Provider value={value} children={children} />;
};
