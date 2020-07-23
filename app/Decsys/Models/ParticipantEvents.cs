using System.Collections.Generic;

namespace Decsys.Models
{
    /// <summary>
    /// An export model for a participant's event data in a survey instance.
    /// </summary>
    public class ParticipantEvents
    {
        public ParticipantEvents(string id) => Id = id;

        public string Id { get; set; }

        /// <summary>
        /// The participant's full event log
        /// </summary>
        public List<ParticipantEvent> Events { get; set; } = new List<ParticipantEvent>();

    }
}
