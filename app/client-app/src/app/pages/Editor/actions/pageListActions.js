import {
  createSurveyPage,
  setSurveyPageOrder,
  deleteSurveyPage,
  duplicateSurveyPage,
  setPageRandomize,
  addSurveyPageItem,
} from "api/pages";
import { setSurveyPageItemOrder } from "api/page-items";
import produce from "immer";
import { v4 as uuid } from "uuid";

export default (id, mutate, selectedPageItem, setSelectedPageItem) => ({
  addPage: async () => {
    const tempId = uuid();
    mutate(
      produce(({ pages }) => {
        pages.push({ id: tempId, components: [], isLoading: true });
      }),
      false
    );
    await createSurveyPage(id);
    mutate();
  },

  duplicatePage: async (pageId) => {
    mutate(
      produce(({ pages }) => {
        const newId = uuid();
        const i = pages.findIndex(({ id }) => id === pageId);
        pages.splice(i + 1, 0, { ...pages[i], id: newId, isLoading: true });
      }),
      false
    );
    await duplicateSurveyPage(id, pageId);
    mutate();
  },

  deletePage: async (pageId) => {
    mutate(
      produce(({ pages }) => {
        const i = pages.findIndex(({ id }) => id === pageId);
        pages.splice(i, 1);
      }),
      false
    );
    if (selectedPageItem.pageId === pageId) setSelectedPageItem({});
    await deleteSurveyPage(id, pageId);
    mutate();
  },

  setPageRandomize: async (pageId, randomize) => {
    mutate(
      produce(({ pages }) => {
        const page = pages.find(({ id }) => id === pageId);
        page.randomize = randomize;
      }),
      false
    );
    await setPageRandomize(id, pageId, randomize);
    mutate();
  },

  movePage: async (pageId, source, destination) => {
    mutate(
      produce(({ pages }) => {
        const [page] = pages.splice(source, 1);
        pages.splice(destination, 0, page);
      }),
      false
    );
    await setSurveyPageOrder(id, pageId, destination + 1);
    mutate();
  },

  addItemToPage: async (pageId, type) => {
    const tempId = uuid();
    mutate(
      produce(({ pages }) => {
        const page = pages.find(({ id }) => id === pageId);
        page.components.push({ id: tempId, type, isLoading: true, params: {} });
      }),
      false
    );
    const { data } = await addSurveyPageItem(id, pageId, type);
    mutate();
    if (!selectedPageItem?.itemId)
      setSelectedPageItem({ pageId, itemId: data.id });
  },

  // This has to be here because it's used higher up than the PageItemActions Context
  movePageItem: async (pageId, itemId, source, destination) => {
    mutate(
      produce(({ pages }) => {
        const { components: pageItems } = pages.find(({ id }) => id === pageId);
        const [item] = pageItems.splice(source, 1);
        pageItems.splice(destination, 0, item);
      }),
      false
    );
    await setSurveyPageItemOrder(id, pageId, itemId, destination + 1);
    mutate();
  },
  mutate,
});
