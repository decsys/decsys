using System.Collections.Generic;

namespace Decsys.Models
{
    public class Survey
    {
        public Survey(string name)
        {
            Name = name;
        }

        public int Id { get; set; }

        public string Name { get; set; }

        public List<Page> Pages { get; set; } = new List<Page>();

        public bool OneTimeParticipants { get; set; }

        public bool UseParticipantIdentifiers { get; set; }

        public List<string> ValidIdentifiers { get; set; } = new List<string>();
    }
}
