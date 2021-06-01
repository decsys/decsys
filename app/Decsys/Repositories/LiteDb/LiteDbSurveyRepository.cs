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
                _surveys.FindAll());

            return summaries.Select(survey =>
                _mapper.Map(
                    _instances.Find(
                        instance => instance.Survey.Id == survey.Id),
                    survey)).ToList();
        }

        public int Create(Models.CreateSurveyModel model, string? ownerId = null)
        {
            var survey = new Survey();
            if (!string.IsNullOrWhiteSpace(model.Name)) survey.Name = model.Name;

            HandleSurveyTypeCreation(model, ref survey);

            return _surveys.Insert(survey);
        }

        private void HandleSurveyTypeCreation(Models.CreateSurveyModel model, ref Survey survey)
        {
            // Handle type settings
            switch (model.Type)
            {
                case SurveyTypes.Prolific:
                    survey.Type = model.Type;
                    HandleProlificSurveyCreation(model, ref survey);
                    break;
            }
        }

        private void HandleProlificSurveyCreation(Models.CreateSurveyModel model, ref Survey survey)
        {
            // Fix some settings based on type
            survey.OneTimeParticipants = true;
            survey.UseParticipantIdentifiers = true;
            survey.ValidIdentifiers = new();

            // TODO: what happens if settings is structured wrong?
            var settings = model.Settings.ToObject<ProlificSettings>();
            const string externalKey = "STUDY_ID";

            // add the type specific settings
            _mapper.Map(model, survey);

            // add / amend a lookup record for this survey type
            var existingLookup = _external.FindOne(x =>
                x.ExternalIdKey == externalKey &&
                x.ExternalIdValue == settings.StudyId);

            if (existingLookup is null)
            {
                _external.Insert(new ExternalLookup(externalKey, settings.StudyId, survey.Id));
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
            if (!string.IsNullOrWhiteSpace(model.Name)) entity.Name = model.Name;
            HandleSurveyTypeCreation(model, ref entity);

            entity.Id = 0;

            return _surveys.Insert(entity);
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
