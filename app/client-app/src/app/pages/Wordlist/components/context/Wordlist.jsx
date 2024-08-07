import { createContext, useContext } from "react";

/**
 * Default values representing a single complete Survey returned from the API
 */
export const wordlistDefaults = {
  id: 0,
  name: "",
};

const WordlistContext = createContext(wordlistDefaults);

/**
 * Use the complete single Survey data provided to the nearest parent SurveyContext
 */
export const useWordlist = () => useContext(WordlistContext);

/**
 * Provide a Survey context.
 * `value` should be a complete (i.e. pre-fetched) Survey given directly to the Provider
 */
export const WordlistProvider = WordlistContext.Provider;
