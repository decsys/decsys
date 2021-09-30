using System;

namespace Decsys.Data.Entities.LiteDb
{
    public class ExternalLookup
    {
        /// <summary>
        /// DO NOT USE. Only provided for ORM use.
        /// </summary>
        [Obsolete]
        public ExternalLookup() { }

        public ExternalLookup(string externalKey, string externalId, int surveyId)
        {
            ExternalIdKey = externalKey;
            ExternalIdValue = externalId;
            SurveyId = surveyId;
        }

        /// <summary>
        /// PK
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// The key name to get the external lookup id from
        /// e.g. for Prolific: `STUDY_ID`
        /// </summary>
        public string ExternalIdKey { get; set; } = string.Empty;

        /// <summary>
        /// The value of the external lookup id for this record
        /// e.g. for Prolific: `STUDY_ID={ExternalIdValue}`
        /// </summary>
        public string ExternalIdValue { get; set; } = string.Empty;

        /// <summary>
        /// Optionally a key name to use to get the Participant ID from external params
        /// e.g. for Prolific: `PROLIFIC_PID`
        /// </summary>
        public string? ParticipantIdKey { get; set; }

        public int SurveyId { get; set; }

        public int? InstanceId { get; set; }
    }
}
