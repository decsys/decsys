import { createContext, useContext } from "react";
import { useSurvey } from "api/surveys";
import { surveyDefaults } from "./Survey";

const FetchSurveyContext = createContext({
  ...surveyDefaults,
  mutate: () => {},
});

/**
 * Use SWR data / mutator for a single Survey from the nearest parent Context
 */
export const useFetchSurvey = () => useContext(FetchSurveyContext);

/**
 * Fetch a single Survey using SWR and provide it via a context
 */
export const FetchSurveyProvider = ({ id, children }) => {
  const { data, mutate } = useSurvey(id);
  const value = { ...data, mutate };
  return <FetchSurveyContext.Provider value={value} children={children} />;
};
