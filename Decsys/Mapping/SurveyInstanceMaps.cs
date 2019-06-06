using AutoMapper;
using Decsys.Data.Entities;
using System;

namespace Decsys.Mapping
{
    public class SurveyInstanceMaps : Profile
    {
        public SurveyInstanceMaps()
        {
            CreateMap<SurveyInstance, Models.BaseSurveyInstanceResults>()
                .ForMember(dest => dest.ExportGenerated, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Survey, opt => opt.MapFrom(src => src.Survey.Name));

            CreateMap(typeof(SurveyInstance), typeof(Models.SurveyInstanceResults<>))
                .IncludeBase(typeof(SurveyInstance), typeof(Models.BaseSurveyInstanceResults))
                .ForMember("Participants", opt => opt.Ignore());

            // These are only used for imports!
            CreateMap<Models.BaseSurveyInstanceResults, SurveyInstance>()
                .ForMember(dest => dest.Survey, opt => opt.Ignore()); // do this manually as we don't export the id

            CreateMap(typeof(Models.SurveyInstanceResults<>), typeof(SurveyInstance))
                .IncludeBase(typeof(Models.BaseSurveyInstanceResults), typeof(SurveyInstance));
        }
    }
}
