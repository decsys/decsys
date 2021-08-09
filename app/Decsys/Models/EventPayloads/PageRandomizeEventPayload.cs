using Newtonsoft.Json;

using System.Collections.Generic;

namespace Decsys.Models.EventPayloads
{
    public class PageRandomizeEventPayload
    {
        [JsonProperty("order")]
        public List<string> Order { get; set; } = new();
    }
}
