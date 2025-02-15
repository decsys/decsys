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
                .ForMember(dest => dest.Settings, opt => opt.ConvertUsing(new LiteDbBsonJObjectConverter()))
                .ForSourceMember(src => src.Pages, opt => opt.DoNotValidate());

            CreateMap<IEnumerable<Data.Entities.LiteDb.SurveyInstance>, SurveySummary>()
                .ConstructUsing(_ => new SurveySummary(string.Empty))
                .ForMember(dest => dest.RunCount,
                    opt => opt.MapFrom(src => src.Count()))
                .ForMember(dest => dest.ActiveInstanceId,
                    opt => opt.MapFrom(src => MapActiveInstanceToId(
                        src.SingleOrDefault(x => x.Closed == null))));

            CreateMap<Data.Entities.Mongo.Survey, SurveySummary>()
                .ConstructUsing(src => new SurveySummary(src.Name))
                .ForMember(dest => dest.Settings, opt => opt.ConvertUsing(new MongoBsonJObjectConverter()))
                .ForSourceMember(src => src.Pages, opt => opt.DoNotValidate());

            CreateMap<IEnumerable<Data.Entities.Mongo.SurveyInstance>, SurveySummary>()
                .ConstructUsing(_ => new SurveySummary(string.Empty))
                .ForMember(dest => dest.RunCount,
                    opt => opt.MapFrom(src => src.Count()))
                .ForMember(dest => dest.ActiveInstanceId,
                    opt => opt.MapFrom(src => MapActiveInstanceToId(
                        src.SingleOrDefault(x => x.Closed == null))));


            // Survey
            CreateMap<Data.Entities.LiteDb.Survey, Survey>()
                .ConstructUsing(src => new Survey(src.Name))
                .ForMember(dest => dest.Settings, opt => opt.ConvertUsing(new LiteDbBsonJObjectConverter()));
            CreateMap<Survey, Data.Entities.LiteDb.Survey>()
                .ForMember(dest => dest.Settings, opt => opt.ConvertUsing(new JObjectLiteDbBsonConverter()))
                .ForMember(dest => dest.ParentSurveyId, opt => opt.MapFrom(src => MapOptionalParentId(src)));
            CreateMap<Data.Entities.Mongo.Survey, Survey>()
                .ConstructUsing(src => new Survey(src.Name))
                .ForMember(dest => dest.Settings, opt => opt.ConvertUsing(new MongoBsonJObjectConverter()));
            CreateMap<Survey, Data.Entities.Mongo.Survey>()
                .ForMember(dest => dest.Settings, opt => opt.ConvertUsing(new JObjectMongoBsonConverter()))
                .ForMember(dest => dest.ParentSurveyId, opt => opt.MapFrom(src => MapOptionalParentId(src)));

            // Survey Type Settings only
            // these will only be used to apply to existing Survey objects
            CreateMap<CreateSurveyModel, Data.Entities.LiteDb.Survey>()
                .ForMember(dest => dest.Settings, opt => opt.ConvertUsing(new JObjectLiteDbBsonConverter()))
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Name, opt => opt.Ignore())
                .ForMember(dest => dest.Type, opt => opt.Ignore())
                .ForMember(dest => dest.IsStudy, opt => opt.Ignore())
                .ForMember(dest => dest.Pages, opt => opt.Ignore())
                .ForMember(dest => dest.PageCreationCounter, opt => opt.Ignore())
                .ForMember(dest => dest.Owner, opt => opt.Ignore())
                .ForMember(dest => dest.ParentSurveyId, opt => opt.Ignore())
                .ForMember(dest => dest.OneTimeParticipants, opt => opt.Ignore())
                .ForMember(dest => dest.UseParticipantIdentifiers, opt => opt.Ignore())
                .ForMember(dest => dest.ValidIdentifiers, opt => opt.Ignore())
                .ForMember(dest => dest.ArchivedDate, opt => opt.Ignore());

            CreateMap<CreateSurveyModel, Data.Entities.Mongo.Survey>()
                .ForMember(dest => dest.Settings, opt => opt.ConvertUsing(new JObjectMongoBsonConverter(), src => src.Settings))
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Name, opt => opt.Ignore())
                .ForMember(dest => dest.Type, opt => opt.Ignore())
                .ForMember(dest => dest.IsStudy, opt => opt.Ignore())
                .ForMember(dest => dest.Pages, opt => opt.Ignore())
                .ForMember(dest => dest.PageCreationCounter, opt => opt.Ignore())
                .ForMember(dest => dest.Owner, opt => opt.Ignore())
                .ForMember(dest => dest.ParentSurveyId, opt => opt.Ignore())
                .ForMember(dest => dest.OneTimeParticipants, opt => opt.Ignore())
                .ForMember(dest => dest.UseParticipantIdentifiers, opt => opt.Ignore())
                .ForMember(dest => dest.ValidIdentifiers, opt => opt.Ignore())
                .ForMember(dest => dest.ArchivedDate, opt => opt.Ignore());



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

            // External Lookups
            CreateMap<Data.Entities.Mongo.ExternalLookup, ExternalLookup>()
                .ConstructUsing((src) => new(src.ExternalIdKey, src.ExternalIdValue, src.SurveyId));
            CreateMap<Data.Entities.LiteDb.ExternalLookup, ExternalLookup>()
                .ConstructUsing((src) => new(src.ExternalIdKey, src.ExternalIdValue, src.SurveyId));
        }

        // HACK: These helpers are sometimes necessary because Expression Trees are limited

        private int? MapActiveInstanceToId(Data.Entities.BaseSurveyInstance? instance)
            => instance?.Id;

        private int? MapOptionalParentId(Survey survey)
            => survey.Parent?.Id;
    }
}
