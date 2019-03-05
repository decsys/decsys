using AutoMapper;
using Decsys.Models;

namespace Decsys.Mapping
{
    public class SurveyMaps : Profile
    {
        public SurveyMaps()
        {
            CreateMap<Data.Entities.Survey, SurveySummary>();
            CreateMap<Data.Entities.Survey, Survey>();
        }
    }
}
