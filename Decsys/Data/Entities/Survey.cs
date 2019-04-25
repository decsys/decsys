using System.Collections.Generic;

namespace Decsys.Data.Entities
{
    public class Survey
    {
        public int Id { get; set; }

        public string Name { get; set; } = "Untitled Survey";

        public IEnumerable<Page> Pages { get; set; } = new List<Page>();

        public bool OneTimeParticipants { get; set; }

        public bool UseParticipantIdentifiers { get; set; }

        public IEnumerable<string> ValidIdentifiers { get; set; } = new List<string>();
    }
}
