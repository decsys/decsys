using LiteDB;

using System.Collections.Generic;

namespace Decsys.Data.Entities.LiteDb
{
    public class Survey : BaseSurvey
    {
        public List<Page> Pages { get; set; } = new();

        public BsonDocument Settings { get; set; } = new BsonDocument();

        public Survey? Parent { get; set; }

        public List<Survey>? Children { get; set; }
    }
}
