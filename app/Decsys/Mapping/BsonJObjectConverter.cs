using System.Linq;
using System.Text.RegularExpressions;
using AutoMapper;
using LiteDB;
using MongoDB.Bson;
using Newtonsoft.Json.Linq;

namespace Decsys.Mapping
{
    public class LiteDbBsonJObjectConverter : IValueConverter<LiteDB.BsonDocument, JObject>
    {
        public JObject Convert(LiteDB.BsonDocument sourceMember, ResolutionContext context)
            => Convert(sourceMember);

        public static JObject Convert(LiteDB.BsonDocument bson)
        {
            var extendedJson = JsonSerializer.Serialize(bson);

            // fix nonQuotable types
            var regex = new Regex(@"\{""\$(?<type>\w+)""\s*:\s*""(?<value>.+?)""\}");
            var matches = regex.Matches(extendedJson);
            var nonQuotable = new[] { "numberLong", "numberDecimal", "minValue", "maxValue" };
            foreach (Match? match in matches)
            {
                if (match is null) continue;

                string type = match.Groups["type"].Value;
                string value = match.Groups["value"].Value;
                extendedJson = extendedJson.Replace(
                    match.Value,
                    nonQuotable.Contains(type) ? value : $@"""{value}""");
            }

            // parse the fixed json string into a JObject
            return JObject.Parse(extendedJson);

            //return JObject.FromObject(sourceMember); // this just returns extended json
        }
    }

    public class MongoBsonJObjectConverter : IValueConverter<MongoDB.Bson.BsonDocument, JObject>
    {
        public JObject Convert(MongoDB.Bson.BsonDocument sourceMember, ResolutionContext context)
            => Convert(sourceMember);

        public static JObject Convert(MongoDB.Bson.BsonDocument bson)
            => JObject.Parse(bson.ToJson());
    }
    public class LiteDbBsonJTokenConverter : IValueConverter<JToken, LiteDB.BsonDocument>
    {
    }
    public class MongoBsonJTokenConverter : IValueConverter<JToken, MongoDB.Bson.BsonDocument>
    {
    }
}




