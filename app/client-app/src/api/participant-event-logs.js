import axios from "axios";
import { decode } from "services/instance-id";
import useSWR from "swr";
import { withHeaders, contentType_AppJson, defaultFetcher } from "./helpers";

export const logParticipantEvent = async (
  instanceId,
  participantId,
  source,
  type,
  payload
) =>
  await axios.post(
    `/api/log/${instanceId}/${participantId}/${source}/${type}`,
    payload,
    withHeaders(contentType_AppJson)
  );

export const getLastLogEntry = async (
  instanceId,
  participantId,
  source,
  type
) =>
  await axios.get(`/api/log/${instanceId}/${participantId}/${source}/${type}`);

export const getLastLogEntryByTypeOnly = async (
  instanceId,
  participantId,
  type
) => await axios.get(`/api/log/${instanceId}/${participantId}/${type}`);

export const useParticipantProgress = (friendlyId, participantId) => {
  let url = null; // null will cause SWR to skip fetching
  if (friendlyId) {
    const [surveyId, instanceId] = decode(friendlyId);
    url = `/api/progress/${surveyId}/${instanceId}/${participantId ?? ""}`;
  }
  return useSWR(url, defaultFetcher(), {
    suspense: true,
  });
};

export const requestParticipantProgress = async (
  friendlyId,
  participantId,
  requestedPageKey
) => {
  const [surveyId, instanceId] = decode(friendlyId);
  return await axios.post(
    `/api/progress/${surveyId}/${instanceId}/${participantId}/${requestedPageKey}`
  );
};
