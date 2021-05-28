using LiteDB;

using System.Collections.Generic;

namespace Decsys.Data.Entities.LiteDb
{
    public class Survey : BaseSurvey
    {
        public List<Page> Pages { get; set; } = new List<Page>();

        public BsonDocument Settings { get; set; } = new BsonDocument();
    }
}
