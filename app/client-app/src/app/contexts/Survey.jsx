import { createContext, useContext } from "react";

/**
 * Default values representing a single complete Survey returned from the API
 */
export const surveyDefaults = {
  id: 0,
  name: "",
  pages: [],
};

const SurveyContext = createContext(surveyDefaults);

/**
 * Use the complete single Survey data provided to the nearest parent SurveyContext
 */
export const useSurvey = () => useContext(SurveyContext);

/**
 * Provide a Survey context.
 * `value` should be a complete (i.e. pre-fetched) Survey given directly to the Provider
 */
export const SurveyProvider = SurveyContext.Provider;
