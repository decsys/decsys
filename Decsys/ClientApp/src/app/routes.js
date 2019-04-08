import React from "react";
import { mount, route, redirect, map, withData, withContext } from "navi";
import * as api from "./api";
import SurveysScreen from "./screens/admin/SurveysScreen";
import EditorScreen from "./screens/admin/EditorScreen";
import PreviewScreen from "./screens/admin/PreviewScreen";
import ErrorScreen from "./screens/ErrorScreen";
import SurveyIdScreen from "./screens/survey/SurveyIdScreen";

const routes = mount({
  "/": map((_, context) =>
    context.user.roles.admin ? redirect("/admin") : redirect("/survey")
  ),

  // Participants
  "/survey": mount({
    "/": route({
      view: <SurveyIdScreen />
    }),
    "/:id": route(({ params }) => {
      // validate the survey instance
      // get the survey itself
      // do we have a user id, if so use it and go
      // if not is the user required to enter an id, or do we generate one?
      return { view: <div>Survey {params.id}</div> };
    })
  }),

  // Admin
  "/admin": map((_, context) =>
    context.user.roles.admin
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
});

export default routes;
