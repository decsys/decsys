import React from "react";
import { mount, route, redirect, map, withData } from "navi";
import * as api from "./api";
import SurveysScreen from "./screens/admin/SurveysScreen";
import EditorScreen from "./screens/admin/EditorScreen";
import PreviewScreen from "./screens/admin/PreviewScreen";
import ErrorScreen from "./screens/ErrorScreen";
import SurveyIdScreen from "./screens/survey/SurveyIdScreen";
import SurveyScreen from "./screens/survey/SurveyScreen";
import { decode } from "./services/instance-id";
import SurveyCompleteScreen from "./screens/survey/SurveyCompleteScreen";

// Note: Some routes here have a lot of data fetching logic,
// because Navi does a great job of delaying component loads while waiting on data.
// When React Suspense gets data fetching support, a lot of logic
// can and should be moved to appropriate components (screens probably)

const routes = mount({
  "/": map((_, context) =>
    context.user.roles.admin ? redirect("/admin") : redirect("/survey")
  ),

  // Participants
  "/survey": mount({
    "/": route({
      view: <SurveyIdScreen />
    }),
    "/:id/complete": route({
      view: <SurveyCompleteScreen /> // TODO: someday this might use the id (and therefore need to verify it)
    }),
    "/:id": route(async ({ params }, { users, user }) => {
      let view;

      const [surveyId, instanceId] = decode(params.id);
      try {
        await api.getSurveyInstance(surveyId, instanceId);

        // get the actual survey data
        const { data: survey } = await api.getSurvey(surveyId);

        // also figure out a User ID
        let userId;
        if (!user.instances[params.id]) {
          userId = (await api.getAnonymousParticipantId()).data;
          users.storeInstanceParticipantId(params.id, userId);
        } else {
          userId = user.instances[params.id];
        }

        view = (
          <SurveyScreen
            combinedId={params.id}
            survey={survey}
            instanceId={instanceId}
            participantId={userId}
          />
        );
      } catch (err) {
        if ([404, 400].includes(err.response && err.response.status))
          view = (
            <ErrorScreen
              message="We couldn't find that Survey. It may have closed already."
              callToAction={{
                label: "Try a different ID",
                onClick: nav => {
                  nav.navigate("/survey");
                }
              }}
            />
          );
        else {
          console.error(err.request);
          console.error(err.message);
          view = <ErrorScreen message="Something went wrong..." />;
        }
      }
      return { view };
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
