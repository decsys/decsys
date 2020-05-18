import { createContext, useContext } from "react";

const PageListActionsContext = createContext({
  addPage: () => {},
  deletePage: () => {},
  duplicatePage: () => {},
  movePage: () => {}
});

export const usePageListActions = () => useContext(PageListActionsContext);

export const PageListActionsProvider = PageListActionsContext.Provider;
