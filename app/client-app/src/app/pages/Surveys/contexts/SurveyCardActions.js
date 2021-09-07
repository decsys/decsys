import { createContext, useContext } from "react";

const SurveyCardActionsContext = createContext({
  launch: () => {},
  close: () => {},
  duplicate: () => {},
  deleteSurvey: async () => {},
  navigate: () => {},
});

export const useSurveyCardActions = () => useContext(SurveyCardActionsContext);

export const SurveyCardActionsProvider = SurveyCardActionsContext.Provider;
