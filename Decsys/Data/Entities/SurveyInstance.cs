using LiteDB;
using System;
using System.Collections.Generic;

namespace Decsys.Data.Entities
{
    public class SurveyInstance : BaseSurveyInstance
    {
        /// <summary>
        /// Create a SurveyInstance belong to a given Survey.
        /// </summary>
        /// <param name="surveyId">ID of the owning Survey.</param>
        /// 
        [Obsolete]
        public SurveyInstance(int surveyId)
        {
            Survey = new Survey { Id = surveyId };
        }

        [BsonRef(Collections.Surveys)]
        public Survey Survey { get; set; } = new Survey { Id = 0 };

    }
}
