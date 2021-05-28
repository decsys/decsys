using Newtonsoft.Json.Linq;

namespace Decsys.Models
{
    public class CreateSurveyModel
    {
        public string? Name { get; set; }

        public string? Type { get; set; }

        public JObject Settings { get; set; } = new JObject();
    }
}
