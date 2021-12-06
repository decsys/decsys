

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Decsys.Data.Entities.Mongo
{
    [BsonIgnoreExtraElements]
    public class ParticipantEvent : BaseParticipantEvent
    {
        public BsonDocument Payload { get; set; } = new BsonDocument();
    }
}
