using LiteDB;
using System;
using System.Collections.Generic;

namespace Decsys.Data.Entities
{
    public class SurveyInstance : BaseSurveyInstance
    {

        [BsonRef(Collections.Surveys)]
        public Survey Survey { get; set; } = new Survey { Id = 0 };

        //Call base constructor for service layer
        public SurveyInstance(int surveyId) : base()
        {

        }

    }
}
