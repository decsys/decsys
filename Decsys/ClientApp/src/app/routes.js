import React from "react";
import { mount, route, redirect, withData } from "navi";
import * as api from "./api";
import SurveysScreen from "./screens/admin/SurveysScreen";
import EditorScreen from "./screens/admin/EditorScreen";

const routes = mount({
  "/": redirect("/admin"),

  // Admin
  "/admin": mount({
    "/": route(async () => {
      const { data: surveys } = await api.listSurveys();

      return {
        view: <SurveysScreen surveys={surveys} />
      };
    }),

    // Survey Editor
    "/survey": mount({
      "/:id": withData(
        async ({ params }) => {
          const { data: survey } = await api.getSurvey(params.id);
          return { survey };
        },
        mount({
          "/": route(async () => {
            return {
              view: <EditorScreen />
            };
          }),
          "/preview": route(({ params }, { test }) => {
            // dispatch(getSurvey(match.params.id));
            // return <PreviewScreen id={match.params.id} />;
            return {
              view: (
                <div>
                  Survey Editor Preview for: {params.id}. {test}
                </div>
              )
            };
          })
        })
      ),
      "/:id/dashboard": route(({ params }) => ({
        view: <div>Dashboard for {params.id}</div>
      }))
    })
  })
});

export default routes;
