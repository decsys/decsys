using Decsys.Constants;

using Newtonsoft.Json.Linq;

namespace Decsys.Models
{
    public class RandomisationStrategy
    {
        public string Strategy { get; set; } = RandomisationStrategies.Hybrid;

        public JObject Settings { get; set; } = new();
    }
}
