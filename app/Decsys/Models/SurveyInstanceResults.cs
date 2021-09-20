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
        /// The original internal ID of the instance. Useful for linking with parents (e.g. in Studies)
        /// </summary>
        public int Id { get; set; }

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

        public List<string> ValidIdentifiers { get; set; } = new();

        public List<int> ChildInstanceIds { get; set; } = new();

        public RandomisationStrategy? RandomisationStrategy { get; set; }
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
        public List<T> Participants { get; set; } = new();
    }
}
