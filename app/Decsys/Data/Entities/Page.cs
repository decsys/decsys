using System;
using System.Collections.Generic;

namespace Decsys.Data.Entities
{
    public class Page : BasePage
    {
        public IEnumerable<Component> Components { get; set; } = new List<Component>();

    }
}
