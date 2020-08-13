using AutoMapper;
using Decsys.Data.Entities.LiteDb;
using System.Collections.Generic;
using System.Linq;

namespace Decsys.Mapping
{
    public class SurveyMaps : Profile
    {
        public SurveyMaps()
        {
            // SurveySummary
            CreateMap<Survey, Models.SurveySummary>()
                .ConstructUsing(src => new Models.SurveySummary(src.Name))
                .ForSourceMember(src => src.Pages, opt => opt.DoNotValidate());

            CreateMap<IEnumerable<SurveyInstance>, Models.SurveySummary>()
                .ConstructUsing(_ => new Models.SurveySummary(string.Empty))
                .ForMember(dest => dest.RunCount,
                    opt => opt.MapFrom(src => src.Count()))
                .ForMember(dest => dest.ActiveInstanceId,
                    opt => opt.MapFrom(src => MapActiveInstanceToId(
                        src.SingleOrDefault(x => x.Closed == null))))
                .ForAllOtherMembers(opt => opt.Ignore());


            // Survey
            CreateMap<Survey, Models.Survey>()
                .ConstructUsing(src => new Models.Survey(src.Name));
            CreateMap<Models.Survey, Survey>();

            // Page
            CreateMap<Page, Models.Page>();
            CreateMap<Models.Page, Page>();

            // Component
            CreateMap<Component, Models.Component>()
                .ForMember(dest => dest.Params,
                    opt => opt.ConvertUsing(new BsonJObjectConverter()));

            CreateMap<Models.Component, Component>()
                .ForMember(dest => dest.Params,
                    opt => opt.ConvertUsing(new JObjectBsonConverter()));
        }

        private int? MapActiveInstanceToId(SurveyInstance? instance)
            => instance?.Id; // Necessary because Expression Trees are limited
    }
}
