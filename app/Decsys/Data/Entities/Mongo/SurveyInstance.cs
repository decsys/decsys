using System;

namespace Decsys.Data.Entities.Mongo
{
    public class SurveyInstance : BaseSurveyInstance
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
            SurveyId = surveyId;
        }

        public int SurveyId { get; set; }

        public RandomisationStrategy? RandomisationStrategy { get; set; }
    }
}
