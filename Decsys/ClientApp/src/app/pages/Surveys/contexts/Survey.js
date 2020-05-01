// TODO: maybe move me to a shared area?

import { createContext, useContext } from "react";

const SurveyContext = createContext({});

export const useSurvey = () => useContext(SurveyContext);

export const SurveyProvider = SurveyContext.Provider;
