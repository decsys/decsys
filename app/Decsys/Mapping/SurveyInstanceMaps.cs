using AutoMapper;
using Decsys.Models;
using System;
using System.Linq;

namespace Decsys.Mapping
{
    public class SurveyInstanceMaps : Profile
    {
        public SurveyInstanceMaps()
        {
            CreateMap<Data.Entities.LiteDb.SurveyInstance, SurveyInstance>()
                .ConstructUsing(_ =>
                    // a dummy one at construction, as we map it anyway
                    new SurveyInstance(new Survey("")));

            CreateMap<SurveyInstance, Data.Entities.LiteDb.SurveyInstance>()
                .ConstructUsing(src =>
                    new Data.Entities.LiteDb.SurveyInstance(src.Survey.Id))
                .ForMember(dest => dest.ChildInstanceIds,
                    opt => opt.MapFrom(src => src.Children.Select(x => x.Id)));

            CreateMap<Data.Entities.Mongo.SurveyInstance, SurveyInstance>()
                .ConstructUsing(_ =>
                    // a dummy one at construction, as we map it anyway
                    new SurveyInstance(new Survey("")));

            CreateMap<SurveyInstance, Data.Entities.Mongo.SurveyInstance>()
                .ConstructUsing(src =>
                    new Data.Entities.Mongo.SurveyInstance(src.Survey.Id))
                .ForMember(dest => dest.ChildInstanceIds,
                    opt => opt.MapFrom(src => src.Children.Select(x => x.Id)));

            // Export
            CreateMap<SurveyInstance, BaseSurveyInstanceResults>()
                .ForMember(dest => dest.ExportGenerated, opt => opt.MapFrom(_ => DateTimeOffset.UtcNow))
                .ForMember(dest => dest.Survey, opt => opt.MapFrom(src => src.Survey.Name));

            CreateMap(typeof(SurveyInstance), typeof(SurveyInstanceResults<>))
                .IncludeBase(typeof(SurveyInstance), typeof(BaseSurveyInstanceResults))
                .ForMember("Participants", opt => opt.Ignore());

            // Import
            CreateMap<BaseSurveyInstanceResults, SurveyInstance>()
                .IncludeAllDerived()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => 0))// always set to 0; we are inserting new instances
                .ForMember(dest => dest.Survey, opt => opt.Ignore()); // do this manually as we don't export the id

            CreateMap<string, Survey>()
                .ConstructUsing(src => new Survey(src));

            // Randomisation Strategy Settings
            CreateMap<RandomisationStrategy, Data.Entities.Mongo.RandomisationStrategy>()
                .ForMember(dest => dest.Settings, opt => opt.ConvertUsing(new JObjectMongoBsonConverter()));

            CreateMap<RandomisationStrategy, Data.Entities.LiteDb.RandomisationStrategy>()
                .ForMember(dest => dest.Settings, opt => opt.ConvertUsing(new JObjectLiteDbBsonConverter()));

            CreateMap<Data.Entities.Mongo.RandomisationStrategy, RandomisationStrategy>()
                .ForMember(dest => dest.Settings, opt => opt.ConvertUsing(new MongoBsonJObjectConverter()));

            CreateMap<Data.Entities.LiteDb.RandomisationStrategy, RandomisationStrategy>()
                .ForMember(dest => dest.Settings, opt => opt.ConvertUsing(new LiteDbBsonJObjectConverter()));
        }
    }
}
