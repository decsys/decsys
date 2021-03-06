using System;
using MongoDB.Bson;

namespace Decsys.Data.Entities.Mongo
{
    public class Component : BaseComponent
    {

        /// <summary>
        /// DO NOT USE. Only provided for ORM use.
        /// </summary>
        [Obsolete]
        public Component() : base() { }

        /// <summary>
        /// Create a Component of the specified type.
        /// </summary>
        /// <param name="type">The component type.</param>
        public Component(string type) : base(type) { }

        public BsonDocument Params { get; set; } = new BsonDocument();
    }
}
