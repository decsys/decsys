using System.Collections.Generic;

namespace Decsys.Data.Entities.Mongo
{
    public class Survey : BaseSurvey
    {
        public List<Page> Pages { get; set; } = new List<Page>();
    }
}
