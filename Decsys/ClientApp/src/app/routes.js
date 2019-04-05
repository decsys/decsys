import React from "react";
import { mount, route, redirect } from "navi";
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
