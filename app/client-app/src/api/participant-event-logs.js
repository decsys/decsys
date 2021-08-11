import axios from "axios";
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
  const url = `/api/progress/${friendlyId}/${participantId ?? ""}`;
  return useSWR(friendlyId ? url : null, defaultFetcher(), {
    suspense: true,
  });
};

export const requestParticipantProgress = async (
  friendlyId,
  participantId,
  requestedPageKey
) =>
  await axios.post(
    `/api/progress/${friendlyId}/${participantId}/${requestedPageKey}`
  );
