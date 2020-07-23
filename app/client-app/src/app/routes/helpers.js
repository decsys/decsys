import * as api from "api";
import {
  PAGE_RANDOMIZE,
  SURVEY_COMPLETE,
  PAGE_LOAD
} from "constants/event-types";
import { randomize } from "services/randomizer";

// Some helpers to make the actual routing logic less noisy
// TODO: there's a good chance some of these should live in actual services...

/**
 * Get the Instance for a given Survey ID and Instance ID
 * but only if the Instance exists **and is active**.
 * @param {*} surveyId
 * @param {*} instanceId
 */
export const tryFetchActiveSurveyInstance = async (surveyId, instanceId) => {
  const { data: instance } = await api.getSurveyInstance(surveyId, instanceId);
  if (instance.closed) {
    const e = new Error();
    e.response = { status: 404 }; // pretend we got a 404 back from the API
    throw e;
  }
  return instance;
};

/**
 * Ask the backend for an "anonymous" Participant ID
 * for this Survey instance and Browser Session
 * @param {string} combinedId Combined encoded Survey and Instance ID
 * @param {object} user current User
 * @param {object} users The Users service
 * @param {boolean} generateIfNotFound
 * Whether to generate an anonymous ID if none found for this session.
 */
export const getInstanceUserId = async (
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

/**
 * Get a Participant's progress through this Survey Instance.
 * @param {number} surveyId The ID of the Survey
 * @param {object} instance The Survey Instance
 * @param {string} userId current User ID
 */
export const getProgress = async (surveyId, instance, userId) => {
  // check logs to set progressStatus and randomisation
  let complete;
  let lastPageLoad;
  try {
    complete = (
      await api.getLastLogEntry(instance.id, userId, surveyId, SURVEY_COMPLETE)
    ).data;
  } catch (err) {
    if (err.response && err.response.status === 404) complete = null;
    else throw err;
  }
  try {
    lastPageLoad = (
      await api.getLastLogEntryByTypeOnly(instance.id, userId, PAGE_LOAD)
    ).data;
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

/**
 * For a given Survey's page configuration
 * generate a suitably random page order
 * for a given Participant.
 * @param {object} survey The Survey
 * @param {number} instanceId Survey Instance ID
 * @param {string} userId current User ID
 */
export const randomizeOrder = async (survey, instanceId, userId) => {
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

/**
 * Get the Survey Page Order for a given Participant
 * or, if none is found, generate and store one.
 * @param {object} survey The Survey
 * @param {number} instanceId Survey Instance ID
 * @param {string} userId current User ID
 */
export const getPageOrder = async (survey, instanceId, userId) => {
  // Note that we always refer to randomising, but in practice
  // the underlying service method will take into account
  // the Survey configuration to determine what randomisation
  // is needed.
  let random;
  try {
    random = (
      await api.getLastLogEntry(instanceId, userId, survey.id, PAGE_RANDOMIZE)
    ).data;
  } catch (err) {
    if (err.response && err.response.status === 404) random = null;
    else throw err;
  }

  return random == null
    ? randomizeOrder(survey, instanceId, userId)
    : random.payload.order;
};
