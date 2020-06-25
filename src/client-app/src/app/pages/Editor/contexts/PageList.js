import React, { createContext, useContext, useState, useMemo } from "react";
import pageListActions from "../actions/pageListActions";
import { useFetchSurvey } from "app/contexts/FetchSurvey";

const PageListContext = createContext({
  addPage: () => {},
  deletePage: pageId => {},
  duplicatePage: pageId => {},
  setPageRandomize: (pageId, randomize) => {},
  movePage: (pageId, source, destination) => {},
  addItemToPage: (pageId, type) => {},
  movePageItem: (pageId, itemId, source, destination) => {},
  mutate: () => {},
  busy: {
    isPageDragging: false,
    isPageItemDragging: false
  },
  setBusy: ({ isPageDragging, isPageItemDragging }) => {},
  selectedPageItem: null,
  setSelectedPageItem: itemId => {}
});

export const usePageListContext = () => useContext(PageListContext);

export const PageListContextProvider = ({ children }) => {
  const { id, mutate } = useFetchSurvey();

  const [busy, setBusy] = useState({});
  const [selectedPageItem, setSelectedPageItem] = useState(null);
  const PageListActions = useMemo(() => pageListActions(id, mutate), [
    id,
    mutate
  ]);

  const value = {
    ...PageListActions,
    busy,
    setBusy,
    selectedPageItem,
    setSelectedPageItem
  };

  return <PageListContext.Provider value={value} children={children} />;
};
