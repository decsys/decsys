import axios from "axios";
import { decode } from "services/instance-id";
import { authorization_BearerToken, withHeaders } from "./helpers";

export const getNextParticipantIdForInstance = async (
  participantId,
  instanceId
) => await axios.get(`/api/identity/${participantId}/${instanceId}/next`);

export const validateParticipantId = async (friendlyId, participantId) => {
  const [surveyId, instanceId] = decode(friendlyId);
  return await axios.get(
    `/api/identity/validate/${surveyId}/${instanceId}/${participantId}`,
    null,
    withHeaders(await authorization_BearerToken())
  );
};
