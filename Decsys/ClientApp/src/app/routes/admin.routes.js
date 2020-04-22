import React from "react";
import { mount, route, map, withData } from "navi";
import * as api from "api";
import {
  SurveysScreen,
  EditorScreen,
  PreviewScreen,
  ResultsScreen,
  DashboardScreen
} from "app/screens/admin";
import { ErrorScreen } from "app/screens";
import { decode } from "services/instance-id";

const admin = map((_, context) =>
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
);

export default admin;
