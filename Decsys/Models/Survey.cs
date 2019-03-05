using System.Collections.Generic;

namespace Decsys.Models
{
    public class Survey
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public IEnumerable<Page> Pages { get; set; }
    }
}
