import React from "react";
import { mount, route } from "navi";
import * as api from "api";
import { decode } from "services/instance-id";
import SurveyIdScreen from "../screens/survey/SurveyIdScreen";
import SurveyScreen from "../screens/survey/SurveyScreen";
import SurveyCompleteScreen from "../screens/survey/SurveyCompleteScreen";
import ParticipantIdScreen from "../screens/survey/ParticipantIdScreen";
import ErrorScreen from "../screens/ErrorScreen";
import {
  tryFetchActiveSurveyInstance,
  getInstanceUserId,
  getProgress,
  getPageOrder
} from "./helpers";

const participants = mount({
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
      const instance = await tryFetchActiveSurveyInstance(surveyId, instanceId);

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
          userId = (
            await api.getNextParticipantIdForInstance(userId, instanceId)
          ).data;
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
});

export default participants;
