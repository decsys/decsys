using System.Collections.Generic;
using System.Linq;

using AutoMapper;

using Decsys.Models;

namespace Decsys.Mapping
{
    public class SurveyMaps : Profile
    {
        public SurveyMaps()
        {
            // SurveySummary
            CreateMap<Data.Entities.LiteDb.Survey, SurveySummary>()
                .ConstructUsing(src => new SurveySummary(src.Name))
                .ForSourceMember(src => src.Pages, opt => opt.DoNotValidate());

            CreateMap<IEnumerable<Data.Entities.LiteDb.SurveyInstance>, SurveySummary>()
                .ConstructUsing(_ => new SurveySummary(string.Empty))
                .ForMember(dest => dest.RunCount,
                    opt => opt.MapFrom(src => src.Count()))
                .ForMember(dest => dest.ActiveInstanceId,
                    opt => opt.MapFrom(src => MapActiveInstanceToId(
                        src.SingleOrDefault(x => x.Closed == null))))
                .ForAllOtherMembers(opt => opt.Ignore());

            CreateMap<Data.Entities.Mongo.Survey, SurveySummary>()
                .ConstructUsing(src => new SurveySummary(src.Name))
                .ForSourceMember(src => src.Pages, opt => opt.DoNotValidate());

            CreateMap<IEnumerable<Data.Entities.Mongo.SurveyInstance>, SurveySummary>()
                .ConstructUsing(_ => new SurveySummary(string.Empty))
                .ForMember(dest => dest.RunCount,
                    opt => opt.MapFrom(src => src.Count()))
                .ForMember(dest => dest.ActiveInstanceId,
                    opt => opt.MapFrom(src => MapActiveInstanceToId(
                        src.SingleOrDefault(x => x.Closed == null))))
                .ForAllOtherMembers(opt => opt.Ignore());


            // Survey
            CreateMap<Data.Entities.LiteDb.Survey, Survey>()
                .ConstructUsing(src => new Survey(src.Name))
                .ForMember(dest => dest.Settings, opt => opt.ConvertUsing(new LiteDbBsonJObjectConverter()));
            CreateMap<Survey, Data.Entities.LiteDb.Survey>()
                .ForMember(dest => dest.Settings, opt => opt.ConvertUsing(new JObjectLiteDbBsonConverter()));
            CreateMap<Data.Entities.Mongo.Survey, Survey>()
                .ConstructUsing(src => new Survey(src.Name))
                .ForMember(dest => dest.Settings, opt => opt.ConvertUsing(new MongoBsonJObjectConverter()));
            CreateMap<Survey, Data.Entities.Mongo.Survey>()
                .ForMember(dest => dest.Settings, opt => opt.ConvertUsing(new JObjectMongoBsonConverter()));

            // Survey Type Settings only
            // these will only be used to apply to existing Survey objects
            CreateMap<CreateSurveyModel, Data.Entities.LiteDb.Survey>()
                .ForMember(dest => dest.Settings, opt => opt.ConvertUsing(new JObjectLiteDbBsonConverter()))
                .ForAllOtherMembers(opt => opt.Ignore());
            CreateMap<CreateSurveyModel, Data.Entities.Mongo.Survey>()
                .ForMember(dest => dest.Settings, opt => opt.ConvertUsing(new JObjectMongoBsonConverter()))
                .ForAllOtherMembers(opt => opt.Ignore());


            // Page
            CreateMap<Data.Entities.LiteDb.Page, Page>();
            CreateMap<Page, Data.Entities.LiteDb.Page>();
            CreateMap<Data.Entities.Mongo.Page, Page>();
            CreateMap<Page, Data.Entities.Mongo.Page>();

            // Component
            CreateMap<Data.Entities.LiteDb.Component, Component>()
                .ForMember(dest => dest.Params,
                    opt => opt.ConvertUsing(new LiteDbBsonJObjectConverter()));
            CreateMap<Component, Data.Entities.LiteDb.Component>()
                .ForMember(dest => dest.Params,
                    opt => opt.ConvertUsing(new JObjectLiteDbBsonConverter()));

            CreateMap<Data.Entities.Mongo.Component, Component>()
               .ForMember(dest => dest.Params,
                   opt => opt.ConvertUsing(new MongoBsonJObjectConverter()));

            CreateMap<Component, Data.Entities.Mongo.Component>()
                .ForMember(dest => dest.Params,
                    opt => opt.ConvertUsing(new JObjectMongoBsonConverter()));
        }

        private int? MapActiveInstanceToId(Data.Entities.BaseSurveyInstance? instance)
            => instance?.Id; // Necessary because Expression Trees are limited
    }
}
