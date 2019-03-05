using LiteDB;

namespace Decsys.Data.Entities
{
    public class Page
    {
        public int Order { get; set; }

        public string Type { get; set; }

        public BsonDocument Params { get; set; }
    }
}
