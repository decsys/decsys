import produce from "immer";
import { v4 as uuid } from "uuid";
import { deleteSurveyPageItem, duplicateSurveyPageItem } from "api/page-items";

export default (surveyId, pageId, mutate) => ({
  duplicatePageItem: async itemId => {
    mutate(
      produce(({ pages: { [pageId]: page } }) => {
        const newId = uuid();
        page.components[newId] = {
          ...page.components[itemId],
          id: newId,
          isLoading: true
        };
        page.componentOrder.push(newId);
      }),
      false
    );
    await duplicateSurveyPageItem(surveyId, pageId, itemId);
    mutate();
  },
  deletePageItem: async itemId => {
    mutate(
      produce(({ pages: { [pageId]: page } }) => {
        const i = page.componentOrder.indexOf(itemId);
        i >= 0 && page.componentOrder.splice(i, 1);
      }),
      false
    );
    await deleteSurveyPageItem(surveyId, pageId, itemId);
    mutate();
  }
});
