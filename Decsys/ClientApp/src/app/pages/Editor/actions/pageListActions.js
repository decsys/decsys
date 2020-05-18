import {
  createSurveyPage,
  setSurveyPageOrder,
  deleteSurveyPage
} from "api/pages";
import remove from "lodash-es/remove";

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

  deletePage: async pageId => {
    await deleteSurveyPage(id, pageId);
    mutate(old => {
      const pages = old.pages.filter(p => p.id !== pageId);
      return { ...old, pages };
    });
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
