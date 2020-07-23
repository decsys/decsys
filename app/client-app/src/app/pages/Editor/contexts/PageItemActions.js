import { createContext, useContext } from "react";

const PageItemActionsContext = createContext({
  duplicatePageItem: itemId => {},
  deletePageItem: itemId => {},
  setParamValue: (itemId, paramKey, paramValue) => {}
});

export const usePageItemActions = () => useContext(PageItemActionsContext);

export const PageItemActionsProvider = PageItemActionsContext.Provider;
