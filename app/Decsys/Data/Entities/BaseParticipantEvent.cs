using System;

namespace Decsys.Data.Entities
{
    public abstract class BaseParticipantEvent
    {
        public int Id { get; set; }

        public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;

        public string Source { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;

    }
}
