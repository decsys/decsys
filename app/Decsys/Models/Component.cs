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

        public Guid Id { get; set; } = Guid.NewGuid();

        public JObject Params { get; set; } = new JObject();

        /// <summary>
        /// Whether this item is used to provide meaningful "Question"
        /// content in aggregated results
        /// </summary>
        public bool IsQuestionItem { get; set; }
    }
}
