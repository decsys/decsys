using System;

namespace Decsys.Data.Entities
{
    public abstract class BasePage
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public int Order { get; set; }

        public bool Randomize { get; set; }
    }
}
