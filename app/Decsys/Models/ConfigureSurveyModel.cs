using System.Collections.Generic;

namespace Decsys.Models
{
    public class ConfigureSurveyModel
    {
        public bool OneTimeParticipants { get; set; }

        public bool UseParticipantIdentifiers { get; set; }

        public List<string> ValidIdentifiers { get; set; } = new List<string>();
    }
}
