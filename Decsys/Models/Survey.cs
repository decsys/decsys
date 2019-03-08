using System.Collections.Generic;

namespace Decsys.Models
{
    public class Survey
    {
        public Survey(string name)
        {
            Name = name;
        }

        public int Id { get; set; }

        public string Name { get; set; }

        public IEnumerable<Page> Pages { get; set; } = new List<Page>();
    }
}
