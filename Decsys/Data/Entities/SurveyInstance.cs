using LiteDB;

namespace Decsys.Data.Entities
{
    public class SurveyInstance
    {
        public int Id { get; set; }

        [BsonRef(Collections.Surveys)]
        public Survey Survey { get; set; }
    }
}
