import React from "react";
import { mount, route, redirect, map, withData, withContext } from "navi";
import * as api from "./api";
import SurveysScreen from "./screens/admin/SurveysScreen";
import EditorScreen from "./screens/admin/EditorScreen";
import PreviewScreen from "./screens/admin/PreviewScreen";
import ErrorScreen from "./screens/ErrorScreen";

const routes = mount({
  "/": redirect("/admin"),

  // Admin
  "/admin": withContext(
    () => {
      return { localAdmin: window.location.hostname === "localhost" };
    },
    map((_, context) =>
      context.localAdmin
        ? mount({
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
                  "/preview": route(() => ({
                    view: <PreviewScreen />
                  }))
                })
              ),
              "/:id/dashboard": route(({ params }) => ({
                view: <div>Dashboard for {params.id}</div>
              }))
            })
          })
        : route({ view: <ErrorScreen message="401: Not Authorized" /> })
    )
  )
});

export default routes;
