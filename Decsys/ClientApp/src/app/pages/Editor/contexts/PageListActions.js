import { createContext, useContext } from "react";

const PageListActionsContext = createContext({
  addPage: () => {},
  deletePage: pageId => {},
  duplicatePage: pageId => {},
  setPageRandomize: (pageId, randomize) => {},
  movePage: (pageId, source, destination) => {},
  addItemToPage: (pageId, type) => {},
  movePageItem: (pageId, itemId, source, destination) => {},
  mutate: () => {}
});

export const usePageListActions = () => useContext(PageListActionsContext);

export const PageListActionsProvider = PageListActionsContext.Provider;
