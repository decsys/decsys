using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Decsys.Data.Entities
{
    public abstract class BaseSurveyInstance
    {
        public int Id { get; set; }

        public DateTimeOffset Published { get; set; } = DateTimeOffset.UtcNow;

        public DateTimeOffset? Closed { get; set; }

        public bool OneTimeParticipants { get; set; }

        public bool UseParticipantIdentifiers { get; set; }

        public IEnumerable<string> ValidIdentifiers { get; set; } = new List<string>();
    }
}
