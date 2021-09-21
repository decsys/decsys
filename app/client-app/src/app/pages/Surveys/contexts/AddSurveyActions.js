import { createContext, useContext } from "react";

const AddSurveyActionsContext = createContext({
  create: async () => {},
  importFile: async () => {},
  loadInternal: async () => {},
});

export const useAddSurveyActions = () => useContext(AddSurveyActionsContext);
export const AddSurveyActionsProvider = AddSurveyActionsContext.Provider;
