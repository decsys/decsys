using LiteDB;

namespace Decsys.Data.Entities.LiteDb
{
    public class ParticipantEvent : BaseParticipantEvent
    {
        /// <summary>
        /// PK
        /// </summary>
        public int Id { get; set; }

        public BsonDocument Payload { get; set; } = new BsonDocument();
    }
}
