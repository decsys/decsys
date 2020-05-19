import {
  createSurveyPage,
  setSurveyPageOrder,
  deleteSurveyPage,
  duplicateSurveyPage,
  setPageRandomize
} from "api/pages";
import produce from "immer";

export default (id, mutate) => ({
  addPage: async () => {
    const { data: page } = await createSurveyPage(id);
    mutate(
      old => ({
        ...old,
        pages: [...old.pages, page]
      }),
      false
    );
  },

  duplicatePage: async pageId => {
    await duplicateSurveyPage(id, pageId);
    mutate(old => ({
      ...old,
      pages: [
        ...old.pages,
        {
          ...old.pages.find(p => p.id === pageId),
          order: old.pages.length + 1,
          id: -1
        }
      ]
    }));
  },

  deletePage: async pageId => {
    await deleteSurveyPage(id, pageId);
    mutate(old => {
      const pages = old.pages.reduce(
        (pages, p) =>
          p.id === pageId
            ? pages
            : [...pages, { ...p, order: pages.length + 1 }],
        []
      );
      return { ...old, pages };
    });
  },

  setPageRandomize: async (pageId, randomize) => {
    await setPageRandomize(id, pageId, randomize);
    mutate(
      produce(old => {
        const p = old.pages.find(p => p.id === pageId);
        p.randomize = randomize;
      })
    );
  },

  movePage: async (targetId, destination) => {
    mutate(old => {
      const source = old.pages.findIndex(page => page.id === targetId);

      return {
        ...old,
        pages: old.pages.reduce((pages, page, i, oldPages) => {
          if (page.id === targetId) return pages;

          const mutations = (
            (i + 1 !== destination && [page]) ||
            (destination > source
              ? [page, oldPages[source]]
              : [oldPages[source], page])
          ).map((p, i) => ({
            ...p,
            order: pages.length + i + 1
          }));

          return [...pages, ...mutations];
        }, [])
      };
    }, false);
    await setSurveyPageOrder(id, targetId, destination);
    mutate();
  }
});
