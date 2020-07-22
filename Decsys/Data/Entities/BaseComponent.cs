using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Decsys.Data.Entities
{
    public abstract class BaseComponent
    {


        /// <summary>
        /// Create a Component of the specified type.
        /// </summary>
        /// <param name="type">The component type.</param>
        /// Constructor with paramters should be in base class but gives error? 
        /*public BaseComponent(string type)
        {
            Type = type;
        } */

        public Guid Id { get; set; } = Guid.NewGuid();

        public int Order { get; set; }

        public string Type { get; set; } = string.Empty;
    }
}
