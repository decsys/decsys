using LiteDB;
using System;

namespace Decsys.Data.Entities
{
    public class SurveyInstance
    {
        public int Id { get; set; }

        [BsonRef(Collections.Surveys)]
        public Survey Survey { get; set; }

        public bool Active { get; set; } = true;

        public DateTimeOffset Published { get; set; } = DateTimeOffset.UtcNow;
    }
}
