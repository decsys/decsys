using System;

namespace Decsys.Data.Entities
{
    public class StudySurveyAllocation
    {
        /// <summary>
        /// DO NOT USE. Only provided for ORM use.
        /// </summary>
        [Obsolete]
        public StudySurveyAllocation() { }

        public StudySurveyAllocation(string participantId, int instanceId)
        {
            ParticipantId = participantId;
            InstanceId = instanceId;
        }

        /// <summary>
        /// PK
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// ID of the Participant
        /// </summary>
        public string ParticipantId { get; set; } = string.Empty;

        /// <summary>
        /// ID of the Survey Instance this Participant is allocated to
        /// </summary>
        public int InstanceId { get; set; }

        /// <summary>
        /// When the allocation happened
        /// </summary>
        public DateTimeOffset Allocated { get; set; } = DateTimeOffset.UtcNow;
    }
}
