using System;
using System.Collections.Generic;
using System.Linq;

using AutoMapper;

using Decsys.Constants;
using Decsys.Data;
using Decsys.Data.Entities;
using Decsys.Data.Entities.LiteDb;
using Decsys.Models.ExternalTypeSettings;
using Decsys.Models.Results;
using Decsys.Repositories.Contracts;

using LiteDB;


namespace Decsys.Repositories.LiteDb
{
    public class LiteDbSurveyRepository : ISurveyRepository
    {
        private readonly ILiteCollection<Survey> _surveys;
        private readonly ILiteCollection<SurveyInstance> _instances;
        private readonly ILiteCollection<ExternalLookup> _external;
        private readonly IMapper _mapper;
        private readonly IParticipantEventRepository _events;

        public LiteDbSurveyRepository(
            LiteDbFactory db,
            IParticipantEventRepository events,
            IMapper mapper)
        {
            _surveys = db.Surveys.GetCollection<Survey>(Collections.Surveys);
            _instances = db.Surveys.GetCollection<SurveyInstance>(Collections.SurveyInstances);
            _external = db.Surveys.GetCollection<ExternalLookup>(Collections.ExternalLookup);
            _mapper = mapper;
            _events = events;
        }

        public bool Exists(int id) =>
            _surveys.Exists(x => x.Id == id);

        public Models.Survey Find(int id) =>
            _mapper.Map<Models.Survey>(
                _surveys.FindById(id));

        public List<Models.SurveySummary> List(string? userId = null, bool includeOwnerless = false)
        {
            var summaries = _mapper.Map<List<Models.SurveySummary>>(
                _surveys.Find(x => x.Parent == null));

            // Reusable enhancement
            Models.SurveySummary EnhanceSummary(Models.SurveySummary survey)
            {
                var instances = _instances
                    .Find(instance =>
                        instance.Survey.Id == survey.Id)
                    .OrderByDescending(x => x.Published)
                    .ToList();

                var summary = _mapper.Map(instances,
                  survey);

                var latestInstanceId = instances.FirstOrDefault()?.Id;

                // validate external link if necessary
                summary.HasInvalidExternalLink =
                    !string.IsNullOrWhiteSpace(summary.Type) &&
                    _external.Find(x =>
                            x.SurveyId == summary.Id &&
                            x.InstanceId == latestInstanceId)
                        .SingleOrDefault() is null;

                return summary;
            }

            return summaries
                .ConvertAll(survey =>
                {
                    var summary = EnhanceSummary(survey);

                    // Get Children for studies
                    if (survey.IsStudy)
                    {
                        summary.Children = _mapper.Map<List<Models.SurveySummary>>(
                            _surveys.Find(x => x.Parent != null && x.Parent.Id == survey.Id).ToList());

                        // they also need enhancing
                        summary.Children = summary.Children.ConvertAll(EnhanceSummary);
                    }

                    return summary;
                })
;
        }

        public int Create(Models.CreateSurveyModel model, string? ownerId = null)
        {
            Survey? parent = null;

            // Some validation
            if (model.ParentSurveyId is not null)
            {
                if (model.IsStudy)
                    throw new ArgumentException("A Study cannot belong to a parent", nameof(model));

                parent = _surveys.FindById(model.ParentSurveyId);

                var parentFailureMessage = $"Can't create a Survey with Parent {model.ParentSurveyId}";

                if (parent is null)
                    throw new KeyNotFoundException(
                        $"{parentFailureMessage}: that Study could not be found.");

                if (!parent.IsStudy)
                    throw new ArgumentException(
                        $"{parentFailureMessage}: that Survey is not a Study and therefore cannot have children.");
            }

            var survey = new Survey { Parent = parent, IsStudy = model.IsStudy };
            if (!string.IsNullOrWhiteSpace(model.Name)) survey.Name = model.Name;

            var lookup = HandleSurveyTypeCreation(model, ref survey);

            var surveyId = _surveys.Insert(survey);

            if (lookup is not null)
                CreateExternalLookup(lookup, survey);

            return surveyId;
        }

        private ExternalLookup? HandleSurveyTypeCreation(Models.CreateSurveyModel model, ref Survey survey)
        {
            // Handle type settings
            switch (model.Type)
            {
                case SurveyTypes.Prolific:
                    survey.Type = model.Type;
                    return HandleProlificSurveyCreation(model, ref survey);
                default:
                    return null;
            }
        }

        private ExternalLookup HandleProlificSurveyCreation(Models.CreateSurveyModel model, ref Survey survey)
        {
            // Fix some settings based on type
            survey.OneTimeParticipants = true;
            survey.UseParticipantIdentifiers = true;
            survey.ValidIdentifiers = new();

            // add the type specific settings
            _mapper.Map(model, survey);

            // TODO: what happens if settings is structured wrong?
            var settings = model.Settings.ToObject<ProlificSettings>();

            // return a partially ready Lookup record
            // with Type specific properties,
            // to be completed after the survey is successfully inserted 
            return new("STUDY_ID", settings.StudyId, survey.Id)
            {
                ParticipantIdKey = "PROLIFIC_PID"
            };
        }

        private void CreateExternalLookup(ExternalLookup lookup, Survey survey)
        {
            // add / amend a lookup record for this survey type
            var existingLookup = _external.FindOne(x =>
                x.ExternalIdKey == lookup.ExternalIdKey &&
                x.ExternalIdValue == lookup.ExternalIdValue);

            if (existingLookup is null)
            {
                lookup.SurveyId = survey.Id;
                _external.Insert(lookup);
            }
            else
            {
                existingLookup.SurveyId = survey.Id;
                existingLookup.InstanceId = null;
                _external.Update(existingLookup);
            }

        }

        public int Create(Models.Survey survey, Models.CreateSurveyModel model, string? ownerId = null)
        {
            var entity = _mapper.Map<Survey>(survey);

            // Reset Type properties
            // when we map the model, these will be accurately restored 
            entity.Type = null;
            entity.Settings = new();

            if (!string.IsNullOrWhiteSpace(model.Name)) entity.Name = model.Name;
            var lookup = HandleSurveyTypeCreation(model, ref entity);

            entity.Id = 0;

            var surveyId = _surveys.Insert(entity);

            if (lookup is not null)
                CreateExternalLookup(lookup, entity);

            return surveyId;
        }

        public void Delete(int id)
        {
            // Delete all Instance Event Logs
            _instances.Find(x => x.Survey.Id == id)
                .Select(x => x.Id)
                .ToList()
                .ForEach(_events.Delete);

            // Delete all Instances
            _instances.DeleteMany(x => x.Survey.Id == id);

            // Delete any external lookup records
            _external.DeleteMany(x => x.SurveyId == id);

            // Delete the Survey
            _surveys.Delete(id);
        }

        public void UpdateName(int id, string name)
        {
            var survey = _surveys.FindById(id) ?? throw new KeyNotFoundException();
            survey.Name = name;
            _surveys.Update(survey);
        }

        public void Update(Models.Survey survey) =>
            _surveys.Update(_mapper.Map<Survey>(survey));

        public SurveyAccessResult TestSurveyAccess(int id, string userId, bool allowOwnerless = false)
        {
            if (!Exists(id)) return new(SurveyAccessStatus.NotFound);
            return new(SurveyAccessStatus.Owned);
        }

        public ExternalLookup LookupExternal(string externalKey, string externalId)
            => _external.FindOne(x => x.ExternalIdKey == externalKey && x.ExternalIdValue == externalId);
    }
}
