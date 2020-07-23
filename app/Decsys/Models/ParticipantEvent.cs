using System;
using Newtonsoft.Json.Linq;

namespace Decsys.Models
{
    public class ParticipantEvent
    {
        public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;

        public string Source { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;

        public JObject Payload { get; set; } = new JObject();
    }
}
