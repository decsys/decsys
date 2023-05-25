using AutoMapper;
using Decsys.Models.Wordlist;
using Newtonsoft.Json.Linq;

namespace Decsys.Mapping;

public class WordlistMap : Profile
{
    public WordlistMap()
    {

        CreateMap<WordlistRules, Data.Entities.Mongo.WordlistRules>()
             .ForMember(dest => dest.Value, opt => opt.ConvertUsing(new JObjectMongoBsonConverter()));

        CreateMap<Data.Entities.Mongo.WordlistRules, WordlistRules>()
             .ForMember(dest => dest.Value, opt => opt.ConvertUsing(new MongoBsonJTokenConverter()));

        CreateMap<WordlistRules, Data.Entities.LiteDb.WordlistRules>()
             .ForMember(dest => dest.Value, opt => opt.ConvertUsing(new JTokenLiteDbBsonConverter()));

        CreateMap<Data.Entities.LiteDb.WordlistRules, WordlistRules>()
             .ForMember(dest => dest.Value, opt => opt.ConvertUsing(new LiteDbBsonJTokenConverter()));

    }
}
