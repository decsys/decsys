using Newtonsoft.Json;

using System.Collections.Generic;

namespace Decsys.Models.EventPayloads
{
    public class PageRandomizeEventPayload
    {
        public List<string> Order { get; set; } = new();
    }
}
