using Newtonsoft.Json.Linq;

using System.Collections.Generic;

namespace Decsys.Models
{
    public class SurveySummary
    {
        public SurveySummary(string name)
        {
            Name = name;
        }

        public bool IsStudy { get; set; }

        public string Type { get; set; } = string.Empty;

        public bool HasInvalidExternalLink { get; set; }

        public JObject Settings { get; set; } = new();

        public int Id { get; set; }

        public string Name { get; set; }

        public int RunCount { get; set; }

        public int? ActiveInstanceId { get; set; }

        public int? ParentSurveyId { get; set; }
        
        public int ActiveInstanceParticipantCount { get; set; }

        public List<SurveySummary>? Children { get; set; }
    }
}
