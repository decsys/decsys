using Newtonsoft.Json.Linq;
using System;

namespace Decsys.Models
{
    public class Page : NewPage
    {
        public Guid Id { get; set; }

        public JObject Params { get; set; }
    }
}