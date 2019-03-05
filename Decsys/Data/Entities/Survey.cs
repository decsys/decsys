using System.Collections.Generic;

namespace Decsys.Data.Entities
{
    public class Survey
    {
        public int Id { get; set; }

        public string Name { get; set; } = "Untitled Survey";

        public IEnumerable<Page> Pages { get; set; } = new List<Page>();
    }
}
