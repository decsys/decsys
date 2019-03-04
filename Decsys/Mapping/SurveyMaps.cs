using AutoMapper;
using Decsys.Data.Entities;
using Decsys.Models;

namespace Decsys.Mapping
{
    public class SurveyMaps : Profile
    {
        public SurveyMaps()
        {
            CreateMap<Survey, SurveySummary>();
        }
    }
}
