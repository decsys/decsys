using LiteDB;
using System;

namespace Decsys.Data.Entities
{
    public class Page
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public int Order { get; set; }

        public string Type { get; set; }

        public BsonDocument Params { get; set; }
    }
}
