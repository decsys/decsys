using LiteDB;
using System;
using System.Collections.Generic;

namespace Decsys.Data.Entities
{
    public class SurveyInstance
    {
        /// <summary>
        /// DO NOT USE. Only provided for ORM use.
        /// </summary>
        [Obsolete]
        public SurveyInstance() { }

        /// <summary>
        /// Create a SurveyInstance belong to a given Survey.
        /// </summary>
        /// <param name="surveyId">ID of the owning Survey.</param>
        public SurveyInstance(int surveyId)
        {
            Survey = new Survey { Id = surveyId };
        }

        public int Id { get; set; }

        [BsonRef(Collections.Surveys)]
        public Survey Survey { get; set; } = new Survey { Id = 0 };

        public DateTimeOffset Published { get; set; } = DateTimeOffset.UtcNow;

        public DateTimeOffset? Closed { get; set; }

        public bool OneTimeParticipants { get; set; }

        public IEnumerable<string> ValidIdentifiers { get; set; } = new List<string>();
    }
}
