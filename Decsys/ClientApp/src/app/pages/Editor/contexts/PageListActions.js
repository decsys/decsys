import { createContext, useContext } from "react";

const PageListActionsContext = createContext({
  addPage: () => {},
  movePage: () => {}
});

export const usePageListActions = () => useContext(PageListActionsContext);

export const PageListActionsProvider = PageListActionsContext.Provider;
