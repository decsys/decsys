using System.Collections.Generic;

namespace Decsys.Data.Entities
{
    public abstract class BaseSurvey
    {
        public int Id { get; set; }

        public bool IsStudy { get; set; }

        public string Name { get; set; } = "Untitled Survey";

        public string? Type { get; set; }

        public bool OneTimeParticipants { get; set; }

        public bool UseParticipantIdentifiers { get; set; }

        public List<string> ValidIdentifiers { get; set; } = new List<string>();

        public string? Owner { get; set; }

        public int? ParentSurveyId { get; set; }
    }
}
