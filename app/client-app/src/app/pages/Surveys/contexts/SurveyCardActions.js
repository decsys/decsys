import { createContext, useContext } from "react";

const SurveyCardActionsContext = createContext({
  launch: () => {},
  close: () => {},
  duplicate: () => {},
  changeStudy: async () => {},
  setSurveyFolder: async () => {},
  deleteSurvey: async () => {},
  deleteFolder: async () => {},
  navigate: () => {},
});

export const useSurveyCardActions = () => useContext(SurveyCardActionsContext);

export const SurveyCardActionsProvider = SurveyCardActionsContext.Provider;
