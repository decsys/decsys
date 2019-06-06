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
                .ForMember(dest => dest.Generated, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.InstancePublished, opt => opt.MapFrom(src => src.Published))
                .ForMember(dest => dest.InstanceClosed, opt => opt.MapFrom(src => src.Closed))
                .ForMember(dest => dest.Survey, opt => opt.MapFrom(src => src.Survey.Name))
                .ForMember(dest => dest.Config, opt => opt.MapFrom(src => new
                    {
                        src.OneTimeParticipants,
                        src.UseParticipantIdentifiers,
                        src.ValidIdentifiers
                    }));

            CreateMap(typeof(SurveyInstance), typeof(Models.SurveyInstanceResults<>))
                .IncludeBase(typeof(SurveyInstance), typeof(Models.BaseSurveyInstanceResults))
                .ForMember("Participants", opt => opt.Ignore());
        }
    }
}
