using System;
using System.Collections.Generic;

namespace Decsys.Models
{

    /// <summary>
    /// A base export model for the results data of a survey instance
    /// </summary>
    public class BaseSurveyInstanceResults
    {
        /// <summary>
        /// A timestamp for when the export was produced
        /// </summary>
        public DateTimeOffset ExportGenerated { get; set; }

        /// <summary>
        /// The timestamp which identifies the Survey Instance, by when it was published
        /// </summary>
        public DateTimeOffset Published { get; set; }

        /// <summary>
        /// The timestamp for when the Survey was closed, if it has been
        /// </summary>
        public DateTimeOffset? Closed { get; set; }

        /// <summary>
        /// The name of the survey the instance (and therefore these results) belong to
        /// </summary>
        public string Survey { get; set; } = string.Empty;

        public bool OneTimeParticipants { get; set; }

        public bool UseParticipantIdentifiers { get; set; }

        public IEnumerable<string> ValidIdentifiers { get; set; } = new List<string>();
    }

    /// <summary>
    /// A generic export model for the results data of a survey instance
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class SurveyInstanceResults<T> : BaseSurveyInstanceResults
    {
        /// <summary>
        /// The instance participants and their export data
        /// </summary>
        public List<T> Participants { get; set; } = new List<T>();
    }
}
