using Newtonsoft.Json.Linq;
using System;

namespace Decsys.Models
{
    public class Component
    {
        public Component(string type)
        {
            Type = type;
        }

        public string Type { get; set; }

        public int Order { get; set; }

        public Guid Id { get; set; }

        public JObject Params { get; set; } = new JObject();
    }
}