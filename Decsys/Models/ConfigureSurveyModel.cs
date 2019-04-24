using System.Collections.Generic;

namespace Decsys.Models
{
    public class ConfigureSurveyModel
    {
        public bool OneTimeParticipants { get; set; }

        public IEnumerable<string> ValidIdentifiers { get; set; } = new List<string>();
    }
}