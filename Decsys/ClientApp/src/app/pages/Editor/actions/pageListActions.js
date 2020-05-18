import { createSurveyPage } from "api/pages";

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
  movePage: async (targetId, destination) => {
    // POST
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
  }
});
