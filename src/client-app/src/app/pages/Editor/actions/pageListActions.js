import {
  createSurveyPage,
  setSurveyPageOrder,
  deleteSurveyPage,
  duplicateSurveyPage,
  setPageRandomize,
  addSurveyPageItem,
} from "api/pages";
import produce from "immer";
import { v4 as uuid } from "uuid";

export default (id, mutate) => ({
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
        const [page] = pages.splice(source - 1, 1);
        pages.splice(destination - 1, 0, page);
      }),
      false
    );
    await setSurveyPageOrder(id, pageId, destination);
    mutate();
  },

  addItemToPage: async (pageId, type) => {
    const tempId = uuid();
    mutate(
      produce(({ pages }) => {
        const page = pages.find(({ id }) => id === pageId);
        page.components.push({ id: tempId, type, isLoading: true });
      }),
      false
    );
    await addSurveyPageItem(id, pageId, type);
    mutate();
  },

  movePageItem: (pageId, itemId, source, destination) => {},
  mutate,
});
