using System.Collections.Generic;

namespace Decsys.Data.Entities
{
    public class Page : BasePage
    {
        public List<Component> Components { get; set; } = new List<Component>();

    }
}
