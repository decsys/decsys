using System.Collections.Generic;

using Decsys.Models;

namespace Decsys.Repositories.Contracts
{
    public interface IParticipantEventRepository
    {
        /// <summary>
        /// Get the current count of Participants for a given Survey Instance
        /// </summary>
        /// <param name="instanceId">ID of the Instance</param>
        /// <returns></returns>
        int GetParticipantCount(int instanceId);

        /// <summary>
        /// List all Participant EventLog collections for this Instance
        /// </summary>
        /// <param name="instanceId">ID of the Instance to list EventLog collections for</param>
        List<string> ListLogs(int instanceId);

        /// <summary>
        /// Get a Participant ID from an underlying Collection Name
        /// </summary>
        /// <param name="instanceId">ID of the instance the participant belongs to</param>
        /// <param name="collectionName">The Participant's collection name</param>
        /// <returns></returns>
        string GetParticipantId(int instanceId, string collectionName);
        
        /// <summary>
        /// List all Events for a Participant, ordered by Timestamp
        /// </summary>
        /// <param name="instanceId">ID of the Instance the Participant belongs to</param>
        /// <param name="participantId">ID of the Participant to list events for</param>
        /// <param name="source">Optional Source value to filter on</param>
        /// <param name="type">Optional Type value to filter on</param>
        List<ParticipantEvent> List(
            int instanceId,
            string participantId,
            string? source = null,
            string? type = null);

        /// <summary>
        /// List all Events for all Participants in the Instance, optionally of a specified type.
        /// </summary>
        /// <param name="instanceId">ID of the Instance to list Events for</param>
        /// <param name="type">Optional event type to filter by</param>
        Dictionary<string, List<ParticipantEvent>> List(int instanceId, string? type = null);

        /// <summary>
        /// Get the next sequential ID for a Participant
        /// </summary>
        /// <param name="instanceId">ID of the Instance the Participant belongs to</param>
        /// <param name="participantIdPrefix">Public Participant ID, that prefixes the internal ID</param>
        /// <returns></returns>
        string NextParticipantId(int instanceId, string participantIdPrefix);

        /// <summary>
        /// Create an Event from the provided model
        /// </summary>
        /// <param name="instanceId">ID of the Instance the Participant is in</param>
        /// <param name="participantId">ID of the Participant to create the Event for</param>
        /// <param name="e">Event model to create from</param>
        void Create(int instanceId, string participantId, ParticipantEvent e);

        /// <summary>
        /// Delete all event logs for this instance.
        /// </summary>
        /// <param name="instanceId">ID of the Instance to delete Logs for</param>
        void Delete(int instanceId);
    }
}

