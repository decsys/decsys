// service methods used when bootstrapping a survey
// for a participant to take

import { v4 as uuid } from "uuid";
import {
  getLastLogEntry,
  getLastLogEntryByTypeOnly,
} from "api/participant-event-logs";
import { SURVEY_COMPLETE, PAGE_LOAD } from "constants/event-types";
import { getNextParticipantIdForInstance } from "api/identity";

/**
 * Get a Participant's progress though a given Survey Instance
 * @param {*} userId
 * @param {*} surveyId
 * @param {*} instance
 */
export const getProgress = async (userId, instance) => {
  let complete;
  let lastPageLoad;
  try {
    complete = (
      await getLastLogEntry(
        instance.id,
        userId,
        instance.survey.id,
        SURVEY_COMPLETE
      )
    ).data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      complete = null;
    } else throw err;
  }
  try {
    lastPageLoad = (
      await getLastLogEntryByTypeOnly(instance.id, userId, PAGE_LOAD)
    ).data;
  } catch (err) {
    if (err.response && err.response.status === 404) lastPageLoad = null;
    else throw err;
  }

  return {
    completed: complete != null,
    lastPageLoaded: lastPageLoad && lastPageLoad.source,
    oneTimeParticipants: instance.oneTimeParticipants,
    inProgress: !complete && lastPageLoad,
  };
};

/**
 * Possible routes to navigate to
 * as a result of a bootstrap attempt
 */
export const routes = {
  INSTANCE_404: 404,
  SURVEY_EMPTY: 0,
  PARTICIPANT_ID_ENTRY: 1,
  SURVEY_COMPLETED: 2,
  BOOTSTRAP_COMPLETE: 99,
};

/**
 * Attempt to bootstrap a Survey Instance for a Participant
 *
 * This is where a LOT of the Participant magic happens
 * @param {*} id combined SurveyId/InstanceId
 * @param {*} instance
 * @param {*} user
 * @param {*} users
 */
export const bootstrapSurvey = async (id, instance, user, users) => {
  //validate instance
  if (!instance || instance.closed) return { route: routes.INSTANCE_404 };
  if (!instance.survey.pages.length) return { route: routes.SURVEY_EMPTY };

  // get / generate user ID
  let userId;
  userId = user.instances[id];
  if (!userId) {
    if (instance.useParticipantIdentifiers)
      return { route: routes.PARTICIPANT_ID_ENTRY };
    else userId = uuid();
  }

  // Get Progress for this user
  let progress;
  progress = await getProgress(userId, instance);

  if (progress.completed) {
    if (instance.oneTimeParticipants)
      // not repeatable!
      return { route: routes.SURVEY_COMPLETED, userId };
    else {
      if (instance.useParticipantIdentifiers) {
        // for entered IDs, get the next unique one
        userId = (await getNextParticipantIdForInstance(userId, instance.id))
          .data;
      } else {
        // for anon: generate a new id
        userId = uuid();
      }

      // reset progress to pretend they're new
      progress = {
        oneTimeParticipants: instance.oneTimeParticipants,
      };
    }
  }

  return { route: routes.BOOTSTRAP_COMPLETE, userId, progress };
};
