import produce from "immer";
import { deleteSurveyPageItem } from "api/page-items";

export default (surveyId, pageId, mutate) => ({
  duplicatePageItem: itemId => {},
  deletePageItem: async itemId => {
    mutate(
      produce(({ pages }) => {
        const page = pages[pageId];
        const i = page.componentOrder.indexOf(itemId);
        i >= 0 && page.componentOrder.splice(i, 1);
      }),
      false
    );
    await deleteSurveyPageItem(surveyId, pageId, itemId);
    mutate();
  }
});
