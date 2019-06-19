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
import ParticipantIdScreen from "./screens/survey/ParticipantIdScreen";
import ResultsScreen from "./screens/admin/ResultsScreen";
import DashboardScreen from "./screens/admin/DashboardScreen";
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

// Some helpers to make the actual routing logic less noisy

const tryFetchActiveSurveyInstance = async (surveyId, instanceId) => {
  const { data: instance } = await api.getSurveyInstance(surveyId, instanceId);
  if (instance.closed) {
    const e = new Error();
    e.response = { status: 404 }; // pretend we got a 404 back from the API
    throw e;
  }
  return instance;
};

const getInstanceUserId = async (
  combinedId,
  user,
  users,
  generateIfNotFound = false
) => {
  if (user.instances[combinedId]) return user.instances[combinedId];

  if (generateIfNotFound) {
    const userId = (await api.getAnonymousParticipantId()).data;
    users.storeInstanceParticipantId(combinedId, userId);
    return userId;
  }

  return null;
};

const getProgress = async (surveyId, instance, userId) => {
  // check logs to set progressStatus and randomisation
  let complete;
  let lastPageLoad;
  try {
    complete = (await api.getLastLogEntry(
      instance.id,
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
      instance.id,
      userId,
      PAGE_LOAD
    )).data;
  } catch (err) {
    if (err.response && err.response.status === 404) lastPageLoad = null;
    else throw err;
  }

  return {
    completed: complete != null,
    lastPageLoaded: lastPageLoad && lastPageLoad.source,
    oneTimeParticipants: instance.oneTimeParticipants,
    inProgress: !complete && lastPageLoad
  };
};

const randomizeOrder = async (survey, instanceId, userId) => {
  const order = randomize(
    survey.pages.reduce((a, page) => {
      a[page.id] = page.randomize;
      return a;
    }, {})
  );
  await api.logParticipantEvent(instanceId, userId, survey.id, PAGE_RANDOMIZE, {
    order
  });
  return order;
};

const getPageOrder = async (survey, instanceId, userId) => {
  let random;
  try {
    random = (await api.getLastLogEntry(
      instanceId,
      userId,
      survey.id,
      PAGE_RANDOMIZE
    )).data;
  } catch (err) {
    if (err.response && err.response.status === 404) random = null;
    else throw err;
  }

  return random == null
    ? randomizeOrder(survey, instanceId, userId)
    : random.payload.order;
};

const routes = mount({
  "/": map((_, context) =>
    context.user.roles.admin ? redirect("/admin") : redirect("/survey")
  ),

  // Participants
  "/survey": mount({
    "/": route({
      view: <SurveyIdScreen />
    }),
    "/:id/complete": route(async ({ params }, { users }) => {
      // if Participants enter Identifiers,
      // then clear the stored ID now
      // so they are asked to enter again next time

      // We don't clear auto-generated ID's, to ensure we can track non-repeatable completion.

      const [surveyId, instanceId] = decode(params.id);
      const { data: instance } = await api.getSurveyInstance(
        surveyId,
        instanceId
      );

      if (instance.useParticipantIdentifiers)
        users.clearInstanceParticipantId(params.id);

      return {
        view: <SurveyCompleteScreen />
      };
    }),
    "/:id": route(async ({ params }, { users, user }) => {
      let view;
      const [surveyId, instanceId] = decode(params.id);

      try {
        const instance = await tryFetchActiveSurveyInstance(
          surveyId,
          instanceId
        );

        let userId = await getInstanceUserId(
          params.id,
          user,
          users,
          !instance.useParticipantIdentifiers
        );
        if (!userId) {
          // we failed to find or generate an id; ask the user to enter one
          return {
            view: (
              <ParticipantIdScreen
                users={users}
                combinedId={params.id}
                validIdentifiers={instance.validIdentifiers}
              />
            )
          };
        }

        let progress = await getProgress(surveyId, instance, userId);

        if (progress.completed && !instance.oneTimeParticipants) {
          if (instance.useParticipantIdentifiers) {
            // for entered id's, get the next unique one
            userId = (await api.getNextParticipantIdForInstance(
              userId,
              instanceId
            )).data;
          } else {
            // for anon: generate a new id
            userId = (await api.getAnonymousParticipantId()).data;
          }

          users.storeInstanceParticipantId(params.id, userId);

          // reset progress to pretend they're new
          progress = {
            oneTimeParticipants: instance.oneTimeParticipants
          };
        }

        const { data: survey } = await api.getSurvey(surveyId);

        const order = await getPageOrder(survey, instanceId, userId);

        view = (
          <SurveyScreen
            combinedId={params.id}
            survey={survey}
            instanceId={instanceId}
            participantId={userId}
            order={order}
            progressStatus={progress}
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
            "/dashboard/:id": route(async ({ params }) => {
              const [surveyId, instanceId] = decode(params.id);
              const { data: survey } = await api.getSurvey(surveyId);
              const { data: results } = await api.getInstanceResultsSummary(
                surveyId,
                instanceId
              );
              return {
                view: (
                  <DashboardScreen
                    instanceId={instanceId}
                    survey={survey}
                    results={results}
                  />
                )
              };
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
