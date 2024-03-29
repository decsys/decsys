import { createContext, useContext } from "react";

const PageItemActionsContext = createContext({
  duplicatePageItem: (itemId) => {},
  deletePageItem: (itemId) => {},
  setQuestionItem: (itemId) => {},
  setParamValue: (itemId, paramKey, paramValue) => {},
  changePageResponseItem: (itemId, type, order) => {},
  setIsOptional: (itemId, optional) => {},
});

export const usePageItemActions = () => useContext(PageItemActionsContext);

export const PageItemActionsProvider = PageItemActionsContext.Provider;
