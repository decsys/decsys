import axios from "axios";
import { authorization_BearerToken, withHeaders } from "./helpers";

export const getNextParticipantIdForInstance = async (
  participantId,
  instanceId
) => await axios.get(`/api/identity/${participantId}/${instanceId}/next`);

export const validateParticipantId = async (friendlyId, participantId) =>
  await axios.get(
    `/api/identity/validate/${friendlyId}/${participantId}`,
    null,
    withHeaders(await authorization_BearerToken())
  );
