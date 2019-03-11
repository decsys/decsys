using Newtonsoft.Json.Linq;
using System;

namespace Decsys.Models
{
    public class Page : NewPage
    {
        public Page(string type) : base(type) { }

        public Guid Id { get; set; }

        public JObject Params { get; set; } = new JObject();
    }
}