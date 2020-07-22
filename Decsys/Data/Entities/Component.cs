using LiteDB;
using System;

namespace Decsys.Data.Entities
{
    //[Obsolete]
    public class Component : BaseComponent
    {
        public BsonDocument Params { get; set; } = new BsonDocument();

        //Call base constructor for service layer
        public Component(string type) : base()
        {

        }
    }
}
