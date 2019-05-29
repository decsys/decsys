using System.Linq;
using System.Text.RegularExpressions;
using AutoMapper;
using LiteDB;
using Newtonsoft.Json.Linq;

namespace Decsys.Mapping
{
    public class BsonJObjectConverter : IValueConverter<BsonDocument, JObject>
    {
        public JObject Convert(BsonDocument sourceMember, ResolutionContext context)
            => Convert(sourceMember);

        public static JObject Convert(BsonDocument bson)
        {
            var extendedJson = JsonSerializer.Serialize(
                                bson,
                                false,
                                false);

            // fix nonQuotable types
            var regex = new Regex(@"\{""\$(?<type>\w+)""\s*:\s*""(?<value>.+?)""\}");
            var matches = regex.Matches(extendedJson);
            var nonQuotable = new[] { "numberLong", "numberDecimal", "minValue", "maxValue" };
            foreach (Match match in matches)
            {
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
}
