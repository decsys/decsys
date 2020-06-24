using System.Collections.Generic;

namespace Decsys.Data.Entities
{
    public class Survey : BaseSurvey
    {
        public IEnumerable<Page> Pages { get; set; } = new List<Page>();
    }
}
