

using MongoDB.Bson;

namespace Decsys.Data.Entities.Mongo
{
    public class ParticipantEvent : BaseParticipantEvent
    {
        public BsonDocument Payload { get; set; } = new BsonDocument();
    }
}
