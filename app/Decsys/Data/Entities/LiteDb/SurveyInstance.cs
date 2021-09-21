using System;
using System.Collections.Generic;

using Decsys.Constants;
using LiteDB;

namespace Decsys.Data.Entities.LiteDb
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
            Survey = new Survey { Id = surveyId };
        }

        [BsonRef(Collections.Surveys)]
        public Survey Survey { get; set; } = new Survey { Id = 0 };

        public RandomisationStrategy? RandomisationStrategy { get; set; }
    }
}
