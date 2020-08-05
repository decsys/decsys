using System;
using System.Collections.Generic;

namespace Decsys.Models
{
    public class SurveyInstance
    {
        /// <summary>
        /// Create a SurveyInstance belong to a given Survey.
        /// </summary>
        /// <param name="surveyId">ID of the owning Survey.</param>
        public SurveyInstance(Survey survey)
        {
            Survey = survey;
        }

        public int Id { get; set; }

        public Survey Survey { get; set; }

        public DateTimeOffset Published { get; set; } = DateTimeOffset.UtcNow;

        public DateTimeOffset? Closed { get; set; }

        public bool OneTimeParticipants { get; set; }

        public bool UseParticipantIdentifiers { get; set; }

        public List<string> ValidIdentifiers { get; set; } = new List<string>();
    }
}
