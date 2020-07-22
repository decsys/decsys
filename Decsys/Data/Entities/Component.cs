using LiteDB;
using System;

namespace Decsys.Data.Entities
{
    //[Obsolete]
    public class Component : BaseComponent
    {

        /// <summary>
        /// DO NOT USE. Only provided for ORM use.
        /// </summary>
        [Obsolete]
        public Component() { }
        //Call base constructor for service layer
        public Component(string type) 
        {
            Type = type;
        }

        public BsonDocument Params { get; set; } = new BsonDocument();


    }
}
