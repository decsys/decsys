using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Decsys.Data.Entities
{
    public abstract class BaseSurvey
    {
        public int Id { get; set; }

        public string Name { get; set; } = "Untitled Survey";
        public bool OneTimeParticipants { get; set; }

        public bool UseParticipantIdentifiers { get; set; }

        public IEnumerable<string> ValidIdentifiers { get; set; } = new List<string>();
    }
}
