import produce from "immer";
import { v4 as uuid } from "uuid";
import { deleteSurveyPageItem, duplicateSurveyPageItem } from "api/page-items";

export default (surveyId, pageId, mutate) => ({
  duplicatePageItem: async itemId => {
    mutate(
      produce(({ pages }) => {
        const newId = uuid();
        const page = pages.find(({ id }) => id === pageId);
        const i = page.components.findIndex(({ id }) => id === itemId);
        page.components.splice(i + 1, 0, {
          ...page.components[i],
          id: newId,
          isLoading: true
        });
      }),
      false
    );
    await duplicateSurveyPageItem(surveyId, pageId, itemId);
    mutate();
  },

  deletePageItem: async itemId => {
    mutate(
      produce(({ pages }) => {
        const page = pages.find(({ id }) => id === pageId);
        const i = page.components.findIndex(({ id }) => id === itemId);
        page.components.splice(i, 1);
      }),
      false
    );
    await deleteSurveyPageItem(surveyId, pageId, itemId);
    mutate();
  }
});
