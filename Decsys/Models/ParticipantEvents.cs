using System.Collections.Generic;

namespace Decsys.Models
{
    /// <summary>
    /// An export model for a participant's event data in a survey instance.
    /// </summary>
    public class ParticipantEvents : IdStub<string>
    {
        /// <summary>
        /// The participant's full event log
        /// </summary>
        public List<ParticipantEvent> Events { get; set; } = new List<ParticipantEvent>();
    }
}
