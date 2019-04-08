import React from "react";
import { mount, route, redirect, withData } from "navi";
import * as api from "./api";
import SurveysScreen from "./screens/admin/SurveysScreen";
import EditorScreen from "./screens/admin/EditorScreen";
import PreviewScreen from "./screens/admin/PreviewScreen";

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
          "/": route(async () => ({
            view: <EditorScreen />
          })),
          "/preview": route(({ params }, { test }) => ({
            view: <PreviewScreen />
          }))
        })
      ),
      "/:id/dashboard": route(({ params }) => ({
        view: <div>Dashboard for {params.id}</div>
      }))
    })
  })
});

export default routes;
