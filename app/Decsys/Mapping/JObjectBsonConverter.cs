using System.IO;
using AutoMapper;
using LiteDB;
using Newtonsoft.Json.Bson;
using Newtonsoft.Json.Linq;

namespace Decsys.Mapping
{
    public class JObjectLiteDbBsonConverter : IValueConverter<JObject, LiteDB.BsonDocument>
    {
        public LiteDB.BsonDocument Convert(JObject sourceMember, ResolutionContext context)
        {
            using var ms = new MemoryStream();
            using BsonDataWriter writer = new BsonDataWriter(ms);

            sourceMember.WriteTo(writer);
            return BsonSerializer.Deserialize(ms.ToArray());
        }
    }

    public class JObjectMongoBsonConverter : IValueConverter<JObject, MongoDB.Bson.BsonDocument>
    {
        public MongoDB.Bson.BsonDocument Convert(JObject sourceMember, ResolutionContext context)
            => MongoDB.Bson.BsonDocument.Parse(sourceMember.ToString());

    }
}
