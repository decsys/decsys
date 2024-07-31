using AutoMapper;
using Decsys.Models.Wordlist;
using Newtonsoft.Json.Linq;

namespace Decsys.Mapping;

public class WordlistMaps : Profile
{
    public WordlistMaps()
    {

        CreateMap<WordlistRules, Data.Entities.Mongo.WordlistRules>()
             .ForMember(dest => dest.Value, opt => opt.ConvertUsing(new JTokenMongoBsonConverter()));

        CreateMap<Data.Entities.Mongo.WordlistRules, WordlistRules>()
             .ForMember(dest => dest.Value, opt => opt.ConvertUsing(new MongoBsonJTokenConverter()));

        CreateMap<WordlistOptions, Data.Entities.WordlistOptions>();
        CreateMap<Data.Entities.WordlistOptions, WordlistOptions>();

        CreateMap<WordlistWord, Data.Entities.WordlistWord>();
        CreateMap<Data.Entities.WordlistWord, WordlistWord>();

        CreateMap<UserWordlist, Data.Entities.Mongo.UserWordlist>();
        CreateMap<Data.Entities.Mongo.UserWordlist, UserWordlist>();
    }
}
