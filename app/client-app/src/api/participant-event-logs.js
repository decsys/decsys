import axios from "axios";
import { appJsonHeaderOptions } from "./helpers";

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
    appJsonHeaderOptions
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
