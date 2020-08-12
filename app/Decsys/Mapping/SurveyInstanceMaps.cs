using AutoMapper;
using Decsys.Data.Entities;
using System;

namespace Decsys.Mapping
{
    public class SurveyInstanceMaps : Profile
    {
        public SurveyInstanceMaps()
        {
            CreateMap<SurveyInstance, Models.SurveyInstance>()
                .ConstructUsing(src =>
                    // a dummy one at construction, as we map it anyway
                    new Models.SurveyInstance(new Models.Survey("")));

            CreateMap<Models.SurveyInstance, SurveyInstance>()
                .ConstructUsing(src =>
                    new SurveyInstance(src.Survey.Id));

            // Export
            CreateMap<Models.SurveyInstance, Models.BaseSurveyInstanceResults>()
                .ForMember(dest => dest.ExportGenerated, opt => opt.MapFrom(_ => DateTimeOffset.UtcNow))
                .ForMember(dest => dest.Survey, opt => opt.MapFrom(src => src.Survey.Name));

            CreateMap(typeof(Models.SurveyInstance), typeof(Models.SurveyInstanceResults<>))
                .IncludeBase(typeof(Models.SurveyInstance), typeof(Models.BaseSurveyInstanceResults))
                .ForMember("Participants", opt => opt.Ignore());

            // These are only used for imports! // TODO: gonna need to fix these
            CreateMap<Models.BaseSurveyInstanceResults, SurveyInstance>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => 0))// always set to 0; we are inserting new instances
                .ForMember(dest => dest.Survey, opt => opt.Ignore()); // do this manually as we don't export the id

            CreateMap(typeof(Models.SurveyInstanceResults<>), typeof(SurveyInstance))
                .IncludeBase(typeof(Models.BaseSurveyInstanceResults), typeof(SurveyInstance));
        }
    }
}
