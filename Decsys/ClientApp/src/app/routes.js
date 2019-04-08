import React from "react";
import { mount, route, redirect, withContext } from "navi";
import Axios from "axios";
import SurveysScreen from "./screens/admin/SurveysScreen";

const routes = mount({
  "/": redirect("/admin"),

  // Admin
  "/admin": mount({
    "/": route(async () => {
      const { data: surveys } = await Axios.get("/api/surveys");

      return {
        view: <SurveysScreen surveys={surveys} />
      };
    }),

    // Survey Editor
    "/survey": mount({
      "/:id": withContext(
        () => ({
          test: "Hello there"
        }),
        mount({
          "/": route(({ params }, { test }) => {
            // dispatch(getSurvey(match.params.id));
            // return <EditorScreen id={match.params.id} />;
            return {
              view: (
                <div>
                  Survey Editor for: {params.id}. {test}
                </div>
              )
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
