using System.Collections.Generic;
using LiteDB;

namespace Decsys.Data.Entities
{
    public class Survey
    {
        public int Id { get; set; }

        public string Name { get; set; } = "Untitled Survey";

        public IEnumerable<BsonDocument> Pages { get; set; } = new List<BsonDocument>();
    }
}
