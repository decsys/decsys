using System;
using System.Collections.Generic;

namespace Decsys.Data.Entities
{
    public abstract class BaseSurveyInstance
    {
        public int Id { get; set; }

        public DateTimeOffset Published { get; set; } = DateTimeOffset.UtcNow;

        public DateTimeOffset? Closed { get; set; }

        public bool OneTimeParticipants { get; set; }

        public bool UseParticipantIdentifiers { get; set; }

        public List<string> ValidIdentifiers { get; set; } = new List<string>();
    }
}
