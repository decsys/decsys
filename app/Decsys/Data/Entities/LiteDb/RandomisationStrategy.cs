using LiteDB;

namespace Decsys.Data.Entities.LiteDb
{
    public class RandomisationStrategy : BaseRandomisationStrategy
    {
        public BsonDocument Settings { get; set; } = new();
    }
}
