using System.Collections.Generic;
using System.Linq;
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
            // SurveySummary

            CreateMap<Data.Entities.Survey, SurveySummary>()
                .ConstructUsing(src => new SurveySummary(src.Name))
                .ForSourceMember(src => src.Pages, opt => opt.DoNotValidate());

            CreateMap<IEnumerable<Data.Entities.SurveyInstance>, SurveySummary>()
                .ConstructUsing(src => new SurveySummary(string.Empty))
                .ForMember(dest => dest.RunCount,
                    opt => opt.MapFrom(src => src.Count()))
                .ForMember(dest => dest.ActiveSessionId,
                    opt => opt.MapFrom(src => MapActiveInstanceToId(
                        src.SingleOrDefault(x => x.Closed == null))))
                .ForAllOtherMembers(opt => opt.Ignore());


            // Survey
            CreateMap<Data.Entities.Survey, Survey>()
                .ConstructUsing(src => new Survey(src.Name));


            // Page
            CreateMap<Data.Entities.Page, Page>()
                .ForMember(dest => dest.Params,
                    opt => opt.MapFrom(
                        src => JObject.Parse(JsonSerializer.Serialize(src.Params, false, false)))); // TODO: make this less dumb?

            CreateMap<NewPage, Data.Entities.Page>();

            CreateMap<Page, Data.Entities.Page>()
                .ForMember(dest => dest.Params,
                    opt => opt.ConvertUsing(new JObjectBsonConverter()));
        }

        private int? MapActiveInstanceToId(Data.Entities.SurveyInstance? instance)
            => instance?.Id; // Necessary because Expression Trees are limited
    }
}
