using LiteDB;
using System;

namespace Decsys.Data.Entities
{
    public class Component
    {
        /// <summary>
        /// DO NOT USE. Only provided for ORM use.
        /// </summary>
        [Obsolete]
        public Component() { }

        /// <summary>
        /// Create a Component of the specified type.
        /// </summary>
        /// <param name="type">The component type.</param>
        public Component(string type)
        {
            Type = type;
        }

        public Guid Id { get; set; } = Guid.NewGuid();

        public int Order { get; set; }

        public string Type { get; set; } = string.Empty;

        public BsonDocument Params { get; set; } = new BsonDocument();
    }
}
