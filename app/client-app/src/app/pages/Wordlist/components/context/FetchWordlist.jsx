import { createContext, useContext } from "react";
import { getWordlistById } from "api/wordlist";
import { wordlistDefaults } from "./Wordlist";

const FetchWordlistContext = createContext({
  ...wordlistDefaults,
  mutate: () => {},
});

/**
 * Use SWR data / mutator for a single Wordlist from the nearest parent Context
 */
export const useFetchWordlist = () => useContext(FetchWordlistContext);

/**
 * Fetch a single Wordlist using SWR and provide it via a context
 */
export const FetchWordlistProvider = ({ id, children }) => {
  const { data, mutate } = getWordlistById(id);
  const value = { ...data, mutate };
  return <FetchWordlistContext.Provider value={value} children={children} />;
};
