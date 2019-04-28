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
import ResultsScreen from "./screens/admin/ResultsScreen";
import {
  PAGE_RANDOMIZE,
  SURVEY_COMPLETE,
  PAGE_LOAD
} from "./utils/event-types";
import { randomize } from "./services/randomizer";

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
        const instance = (await api.getSurveyInstance(surveyId, instanceId))
          .data;

        // get the actual survey data
        const { data: survey } = await api.getSurvey(surveyId);

        // also figure out a User ID
        let userId;
        if (!user.instances[params.id]) {
          if (instance.useParticipantIdentifiers)
            return {
              view: <div>Hello</div>
            };
          else userId = (await api.getAnonymousParticipantId()).data;
          users.storeInstanceParticipantId(params.id, userId);
        } else {
          userId = user.instances[params.id];
        }

        // check logs to set progressStatus and randomisation
        let complete;
        let lastPageLoad;
        try {
          complete = (await api.getLastLogEntry(
            instanceId,
            userId,
            surveyId,
            SURVEY_COMPLETE
          )).data;
        } catch (err) {
          if (err.response && err.response.status === 404) complete = null;
          else throw err;
        }
        try {
          lastPageLoad = (await api.getLastLogEntryByTypeOnly(
            instanceId,
            userId,
            PAGE_LOAD
          )).data;
        } catch (err) {
          if (err.response && err.response.status === 404) lastPageLoad = null;
          else throw err;
        }

        let progressStatus = {
          completed: complete != null,
          lastPageLoaded: lastPageLoad && lastPageLoad.source,
          oneTimeParticipants: instance.oneTimeParticipants,
          inProgress: !(
            complete &&
            lastPageLoad &&
            complete.timestamp >= lastPageLoad.timestamp
          )
        };

        let random;
        let order;
        try {
          random = (await api.getLastLogEntry(
            instanceId,
            userId,
            surveyId,
            PAGE_RANDOMIZE
          )).data;
        } catch (err) {
          if (err.response && err.response.status === 404) random = null;
          else throw err;
        }

        const randomizeOrder = () => {
          const order = randomize(
            survey.pages.reduce((a, page) => {
              a[page.id] = page.randomize;
              return a;
            }, {})
          );
          api.logParticipantEvent(
            instanceId,
            userId,
            surveyId,
            PAGE_RANDOMIZE,
            { order }
          );
          return order;
        };

        if (random != null) {
          // check the random log is newer than SURVEY_COMPLETE, if there is one
          if (!complete) order = random.payload.order;
          else if (complete.timestamp < random.timestamp)
            order = random.payload.order;
          else order = randomizeOrder(); // otherwise, new randomisation
        } else {
          order = randomizeOrder(); // new randomisation
        }

        view = (
          <SurveyScreen
            combinedId={params.id}
            survey={survey}
            instanceId={instanceId}
            participantId={userId}
            order={order}
            progressStatus={progressStatus}
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
            "/:id/dashboard": route(({ params }) => {
              //TODO: fetch active instance for survey id, if any
              return { view: <div>Dashboard for {params.id}</div> };
            }),
            "/:id/results": route(async ({ params }) => {
              const { data: instances } = await api.listSurveyInstances(
                params.id
              );

              const { data: survey } = await api.getSurvey(params.id); // TODO: could be smaller payload

              return {
                view: <ResultsScreen instances={instances} survey={survey} />
              };
            })
          })
        })
      : route({ view: <ErrorScreen message="401: Not Authorized" /> })
  )
});

export default routes;
