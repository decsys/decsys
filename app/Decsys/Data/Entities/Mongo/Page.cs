using System.Collections.Generic;

namespace Decsys.Data.Entities.Mongo
{
    public class Page : BasePage
    {
        public List<Component> Components { get; set; } = new List<Component>();

    }
}
