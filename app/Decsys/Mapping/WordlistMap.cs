using AutoMapper;
using Decsys.Models.Wordlist;


namespace Decsys.Mapping;

public class WordlistMap : Profile
{
    public WordlistMap()
    {
        CreateMap<WordlistRules, Data.Entities.LiteDb.WordlistRules>()
            .ForMember(dest => dest.Value, opt => opt.ConvertUsing(new JTokenLiteDbBsonConverter()));
        CreateMap<Data.Entities.LiteDb.WordlistRules, WordlistRules>()
            .ForMember(dest => dest.Value, opt => opt.ConvertUsing(new LiteDbBsonJTokenConverter()));

        CreateMap<WordlistRules, Data.Entities.Mongo.WordlistRules>()
            .ForMember(dest => dest.Value, opt => opt.ConvertUsing(new JTokenMongoBsonConverter()));
        CreateMap<Data.Entities.Mongo.WordlistRules, WordlistRules>()
            .ForMember(dest => dest.Value, opt => opt.ConvertUsing(new MongoBsonJTokenConverter()));


    }
}
