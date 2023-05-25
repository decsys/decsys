using AutoMapper;
using Decsys.Models.Wordlist;
using Newtonsoft.Json.Linq;

namespace Decsys.Mapping;

public class WordlistMap : Profile
{
    public WordlistMap()
    {

        CreateMap<LiteDB.BsonValue, JToken>()
            .ConvertUsing<JTokenLiteDbBsonConverter>();

        CreateMap<MongoDB.Bson.BsonValue, JToken>()
            .ConvertUsing<JTokenMongoBsonConverter>();

        CreateMap<WordlistRules, Data.Entities.LiteDb.WordlistRules>()
            .ForMember(dest => dest.Value,
                opt => opt.ConvertUsing<LiteDbBsonJTokenConverter, JToken>());

        CreateMap<WordlistRules, Data.Entities.Mongo.WordlistRules>()
            .ForMember(dest => dest.Value,
                opt => opt.ConvertUsing<MongoBsonJTokenConverter, JToken>());
    }
}
