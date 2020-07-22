using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Decsys.Data.Entities
{
    public abstract class BaseSurveyInstance
    {


        /// <summary>
        /// Create a SurveyInstance belong to a given Survey.
        /// </summary>
        /// <param name="surveyId">ID of the owning Survey.</param>
        /// 

        /*public BaseSurveyInstance(int surveyId)
        {
            Survey survey  = new Survey { Id = surveyId };
        } */


        public int Id { get; set; }

        public DateTimeOffset Published { get; set; } = DateTimeOffset.UtcNow;

        public DateTimeOffset? Closed { get; set; }

        public bool OneTimeParticipants { get; set; }

        public bool UseParticipantIdentifiers { get; set; }

        public IEnumerable<string> ValidIdentifiers { get; set; } = new List<string>();
    }
}
