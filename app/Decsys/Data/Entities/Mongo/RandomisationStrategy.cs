using MongoDB.Bson;

namespace Decsys.Data.Entities.Mongo
{
    public class RandomisationStrategy : BaseRandomisationStrategy
    {
        public BsonDocument Settings { get; set; } = new();
    }
}
