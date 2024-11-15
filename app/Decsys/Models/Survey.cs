using Newtonsoft.Json.Linq;

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

        public bool IsStudy { get; set; }

        public string? Type { get; set; }

        public List<Page> Pages { get; set; } = new List<Page>();

        public bool OneTimeParticipants { get; set; }

        public bool UseParticipantIdentifiers { get; set; }

        public List<string> ValidIdentifiers { get; set; } = new List<string>();

        public JObject Settings { get; set; } = new JObject();

        public Survey? Parent { get; set; }

        public DateTimeOffset? ArchivedDate { get; set; }
    }
}
