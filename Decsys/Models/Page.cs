using System;
using System.Collections.Generic;

namespace Decsys.Models
{
    public class Page
    {
        public Guid Id { get; set; }

        public int Order { get; set; }

        public IEnumerable<Component> Components { get; set; } = new List<Component>();
    }
}