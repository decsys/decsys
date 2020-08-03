import axios from "axios";

export const getNextParticipantIdForInstance = async (
  participantId,
  instanceId
) => await axios.get(`/api/identity/${participantId}/${instanceId}/next`);
