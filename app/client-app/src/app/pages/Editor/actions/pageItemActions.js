import produce from "immer";
import { v4 as uuid } from "uuid";
import {
  deleteSurveyPageItem,
  duplicateSurveyPageItem,
  setSurveyPageItemParam,
  setSurveyPageItemOrder,
  setSurveyPageItemToQuestionItem,
} from "api/page-items";
import { addSurveyPageItem } from "api/pages";
import { setSurveyPageItemToMandatory } from "api/page-items";

export const pageItemActions = (
  surveyId,
  pageId,
  mutate,
  selectedPageItem,
  setSelectedPageItem
) => ({
  duplicatePageItem: async (itemId) => {
    mutate(
      produce(({ pages }) => {
        const newId = uuid();
        const page = pages.find(({ id }) => id === pageId);
        const i = page.components.findIndex(({ id }) => id === itemId);
        page.components.splice(i + 1, 0, {
          ...page.components[i],
          id: newId,
          isLoading: true,
        });
      }),
      false
    );
    await duplicateSurveyPageItem(surveyId, pageId, itemId);
    mutate();
  },

  deletePageItem: async (itemId) => {
    mutate(
      produce(({ pages }) => {
        const page = pages.find(({ id }) => id === pageId);
        const i = page.components.findIndex(({ id }) => id === itemId);
        page.components.splice(i, 1);

        if (selectedPageItem.itemId === itemId) {
          if (i > 0)
            setSelectedPageItem({ pageId, itemId: page.components[i - 1].id });
          else if (i !== page.components.length)
            setSelectedPageItem({ pageId, itemId: page.components[i].id });
          else setSelectedPageItem({});
        }
      }),
      false
    );

    await deleteSurveyPageItem(surveyId, pageId, itemId);
    mutate();
  },
  setQuestionItem: async (itemId) => {
    mutate(
      produce(({ pages }) => {
        const page = pages.find(({ id }) => id === pageId);
        const item = page.components.find(({ id }) => id === itemId);
        const questionItem = page.components.find(
          (item) => item.isQuestionItem === true
        );
        questionItem.isQuestionItem = false;
        item.isQuestionItem = true;
      }),
      false
    );

    await setSurveyPageItemToQuestionItem(surveyId, pageId, itemId);
    mutate();
  },

  setIsOptional: async (surveyId, pageId, itemId, optional) => {
    mutate(
      produce(({ pages }) => {
        const page = pages.find(({ id }) => id === pageId);
        const item = page.components.find(({ id }) => id === itemId);
        item.isOptional = optional;
      }),
      false
    );

    await setSurveyPageItemToMandatory(surveyId, pageId, itemId, optional);
    mutate();
  },

  setParamValue: async (itemId, paramKey, value) => {
    mutate(
      produce(({ pages }) => {
        const page = pages.find(({ id }) => id === pageId);
        const item = page.components.find(({ id }) => id === itemId);
        item.params[paramKey] = value;
      }),
      false
    );
    await setSurveyPageItemParam(surveyId, pageId, itemId, paramKey, value);
    mutate();
  },
  changePageResponseItem: async (itemId, type, order) => {
    mutate(
      produce(({ pages }) => {
        const newId = uuid();
        const page = pages.find(({ id }) => id === pageId);
        const i = page.components.findIndex(({ id }) => id === itemId);
        page.components[i] = {
          id: newId,
          type,
          isLoading: true,
          params: {},
        };
      }),
      false
    );

    if (itemId) await deleteSurveyPageItem(surveyId, pageId, itemId);

    if (type) {
      const { data } = await addSurveyPageItem(surveyId, pageId, type);

      if (itemId)
        await setSurveyPageItemOrder(surveyId, pageId, data.id, order);
    }

    mutate();
  },
});
