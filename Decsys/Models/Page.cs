using Newtonsoft.Json.Linq;

namespace Decsys.Models
{
    public class Page
    {
        public int Order { get; set; }

        public string Type { get; set; }

        public JObject Params { get; set; }
    }
}