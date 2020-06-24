import { createContext, useContext } from "react";

const AddSurveyActionsContext = createContext({
  create: () => {},
  importFile: () => {},
  loadInternal: () => {}
});

export const useAddSurveyActions = () => useContext(AddSurveyActionsContext);
export const AddSurveyActionsProvider = AddSurveyActionsContext.Provider;
