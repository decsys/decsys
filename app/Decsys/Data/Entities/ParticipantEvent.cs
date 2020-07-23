using LiteDB;
using System;

namespace Decsys.Data.Entities
{
    public class ParticipantEvent : BaseParticipantEvent
    {
        public BsonDocument Payload { get; set; } = new BsonDocument();
    }
}
