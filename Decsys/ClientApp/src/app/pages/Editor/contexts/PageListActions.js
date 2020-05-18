import { createContext, useContext } from "react";

const PageListActionsContext = createContext({
  addPage: () => {},
  deletePage: () => {},
  movePage: () => {}
});

export const usePageListActions = () => useContext(PageListActionsContext);

export const PageListActionsProvider = PageListActionsContext.Provider;
