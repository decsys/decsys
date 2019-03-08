using LiteDB;
using System;

namespace Decsys.Data.Entities
{
    public class SurveyInstance
    {
        public SurveyInstance() { }

        public SurveyInstance(int surveyId)
        {
            Survey = new Survey { Id = surveyId };
        }

        public int Id { get; set; }

        [BsonRef(Collections.Surveys)]
        public Survey Survey { get; set; } = new Survey { Id = 0 };

        public DateTimeOffset Published { get; set; } = DateTimeOffset.UtcNow;

        public DateTimeOffset? Closed { get; set; }
    }
}
