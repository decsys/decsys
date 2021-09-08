import { createContext, useContext } from "react";

const SurveysListContext = createContext({
  surveys: {},
  mutateSurveys: () => {},
});

export const useSurveysList = () => useContext(SurveysListContext);

export const SurveysListProvider = SurveysListContext.Provider;
