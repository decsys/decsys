using System.IO;
using AutoMapper;
using LiteDB;
using Newtonsoft.Json.Bson;
using Newtonsoft.Json.Linq;

namespace Decsys.Mapping
{
    public class JObjectBsonConverter : IValueConverter<JObject, BsonDocument>
    {
        public BsonDocument Convert(JObject sourceMember, ResolutionContext context)
        {
            var ms = new MemoryStream();
            using (BsonWriter writer = new BsonWriter(ms))
            {
                sourceMember.WriteTo(writer);
            }

            return BsonSerializer.Deserialize(ms.ToArray());
        }
    }
}
