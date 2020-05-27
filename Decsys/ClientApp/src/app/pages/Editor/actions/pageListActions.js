import {
  createSurveyPage,
  setSurveyPageOrder,
  deleteSurveyPage,
  duplicateSurveyPage,
  setPageRandomize
} from "api/pages";
import produce from "immer";
import { v4 as uuid } from "uuid";

export default (id, mutate) => ({
  addPage: async () => {
    const tempId = uuid();

    mutate(
      produce(({ pages, pageOrder }) => {
        pages[tempId] = { id: tempId, loading: true };
        pageOrder.push(tempId);
      }),
      false
    );
    const { data: page } = await createSurveyPage(id);
    mutate(
      produce(({ pages, pageOrder }) => {
        pages[page.id] = page;
        const i = pageOrder.findIndex(p => p === tempId);
        pageOrder.splice(i, 1);
        pageOrder.splice(page.order - 1, 0, page.id);
      }),
      false
    );
  },

  duplicatePage: async pageId => {
    mutate(
      produce(({ pages, pageOrder }) => {
        const newId = uuid();
        pages[newId] = { ...pages[pageId], id: newId, loading: true };
        pageOrder.push(newId);
      }),
      false
    );
    await duplicateSurveyPage(id, pageId);
    mutate();
  },

  deletePage: async pageId => {
    mutate(
      produce(({ pageOrder }) => {
        const i = pageOrder.findIndex(p => p === pageId);
        pageOrder.splice(i, 1);
      }),
      false
    );
    await deleteSurveyPage(id, pageId);
    mutate();
  },

  setPageRandomize: async (pageId, randomize) => {
    mutate(
      produce(({ pages }) => {
        pages[pageId].randomize = randomize;
      }),
      false
    );
    await setPageRandomize(id, pageId, randomize);
    mutate();
  },

  movePage: async (pageId, source, destination) => {
    mutate(
      produce(({ pageOrder }) => {
        const id = pageOrder.splice(source - 1, 1);
        pageOrder.splice(destination - 1, 0, id);
      }),
      false
    );
    await setSurveyPageOrder(id, pageId, destination);
    mutate();
  }
});
