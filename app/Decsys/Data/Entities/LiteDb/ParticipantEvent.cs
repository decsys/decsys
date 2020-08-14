using LiteDB;

namespace Decsys.Data.Entities.LiteDb
{
    public class ParticipantEvent : BaseParticipantEvent
    {
        public BsonDocument Payload { get; set; } = new BsonDocument();
    }
}
