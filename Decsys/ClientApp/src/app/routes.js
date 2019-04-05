import React from "react";
import { mount, lazy, route, redirect } from "navi";

const routes = mount({
  "/": redirect("/admin"),

  // Admin
  "/admin": mount({
    "/": route(() => {
      // dispatch(fetchSurveys());
      // return <SurveysScreen />;

      return {
        view: <div>Surveys List</div>
      };
    }),

    // Survey Editor
    "/survey": mount({
      "/:id": mount({
        "/": route(({ params }) => {
          // dispatch(getSurvey(match.params.id));
          // return <EditorScreen id={match.params.id} />;
          return { view: <div>Survey Editor for: {params.id}</div> };
        }),
        "/preview": route(({ params }) => {
          // dispatch(getSurvey(match.params.id));
          // return <PreviewScreen id={match.params.id} />;
          return { view: <div>Survey Editor Preview for: {params.id}</div> };
        })
      })
    })
  })
});

export default routes;
