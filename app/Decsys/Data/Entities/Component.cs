using LiteDB;
using System;

namespace Decsys.Data.Entities
{
    public class Component : BaseComponent
    {

        /// <summary>
        /// DO NOT USE. Only provided for ORM use.
        /// </summary>
        [Obsolete]
        public Component() { }

        public Component(string type) : base(type)
        {
        }

        public BsonDocument Params { get; set; } = new BsonDocument();


    }
}
