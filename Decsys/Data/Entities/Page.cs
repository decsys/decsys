using LiteDB;
using System;

namespace Decsys.Data.Entities
{
    public class Page
    {
        /// <summary>
        /// DO NOT USE. Only provided for ORM use.
        /// </summary>
        [Obsolete]
        public Page() { }

        /// <summary>
        /// Create a Page of the specified type.
        /// </summary>
        /// <param name="type">The page type.</param>
        public Page(string type)
        {
            Type = type;
        }

        public Guid Id { get; set; } = Guid.NewGuid();

        public int Order { get; set; }

        // should never be empty!
        public string Type { get; set; } = string.Empty;

        public BsonDocument Params { get; set; } = new BsonDocument();
    }
}
