import React, { createContext, useContext, useState, useMemo } from "react";
import pageListActions from "../actions/pageListActions";
import { useFetchSurvey } from "app/contexts/FetchSurvey";

const defaults = {
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
  selectedPageItem: { pageId: undefined, itemId: undefined },
  setSelectedPageItem: ({ pageId, itemId }) => {}
};

const PageListContext = createContext(defaults);

export const usePageListContext = () => useContext(PageListContext);

export const PageListContextProvider = ({ children }) => {
  const { id, mutate } = useFetchSurvey();

  const [busy, setBusy] = useState(defaults.busy);
  const [selectedPageItem, setSelectedPageItem] = useState(
    defaults.selectedPageItem
  );
  const PageListActions = useMemo(
    () => pageListActions(id, mutate, selectedPageItem, setSelectedPageItem),
    [id, mutate, selectedPageItem, setSelectedPageItem]
  );

  const value = {
    ...PageListActions,
    busy,
    setBusy,
    selectedPageItem,
    setSelectedPageItem
  };

  return <PageListContext.Provider value={value} children={children} />;
};
