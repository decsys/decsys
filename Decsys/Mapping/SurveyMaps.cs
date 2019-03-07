using System;
using AutoMapper;
using Decsys.Models;
using LiteDB;
using Newtonsoft.Json.Linq;

namespace Decsys.Mapping
{
    public class SurveyMaps : Profile
    {
        public SurveyMaps()
        {
            CreateMap<Data.Entities.Survey, SurveySummary>();
            CreateMap<Data.Entities.Survey, Survey>();

            CreateMap<Data.Entities.Page, Page>()
                .ForMember(dest => dest.Params,
                    opt => opt.MapFrom(
                        src => JObject.Parse(JsonSerializer.Serialize(src.Params, false, false)))); // TODO: make this less dumb?
            CreateMap<NewPage, Data.Entities.Page>();
            CreateMap<Page, Data.Entities.Page>()
                .ForMember(dest => dest.Params,
                    opt => opt.ConvertUsing(new JObjectBsonConverter()));
        }
    }
}
