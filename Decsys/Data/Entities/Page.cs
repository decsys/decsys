using System;
using System.Collections.Generic;

namespace Decsys.Data.Entities
{
    public class Page
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public int Order { get; set; }

        public IEnumerable<Component> Components { get; set; } = new List<Component>();

        public bool Randomize { get; set; }
    }
}
