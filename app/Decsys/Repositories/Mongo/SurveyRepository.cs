using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Decsys.Config;
using Decsys.Constants;
using Decsys.Data.Entities.Mongo;
using Decsys.Models.Results;
using Decsys.Repositories.Contracts;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Decsys.Repositories.Mongo
{
    public class SurveyRepository : ISurveyRepository
    {
        private readonly IMongoCollection<Survey> _surveys;
        private readonly IMongoCollection<SurveyInstance> _instances;
        private readonly IParticipantEventRepository _events;
        private readonly IMapper _mapper;

        public SurveyRepository(
            IOptions<HostedDbSettings> config,
            IMongoClient mongo,
            IParticipantEventRepository events,
            IMapper mapper)
        {
            var db = mongo.GetDatabase(config.Value.DatabaseName);
            _surveys = db.GetCollection<Survey>(Collections.Surveys);
            _instances = db.GetCollection<SurveyInstance>(Collections.SurveyInstances);
            _events = events;
            _mapper = mapper;
        }

        private int GetNextSurveyId()
        {
            // mongo has no integer id generator
            // so we set integer id's at insert
            // TODO: this has the same issue as LiteDb
            // in that it will restart from 1
            // if all records are deleted
            var lastId = _surveys.Find(new BsonDocument())
                .SortByDescending(x => x.Id)
                .FirstOrDefault()?
                .Id ?? 0;

            return ++lastId;
        }

        public int Create(Models.CreateSurveyModel model, string? ownerId = null)
        {
            var id = GetNextSurveyId();

            var survey = new Survey { Id = id, Owner = ownerId };
            if (!string.IsNullOrWhiteSpace(model.Name))
                survey.Name = model.Name;

            // Handle type settings
            switch (model.Type)
            {
                case SurveyTypes.Prolific:
                    survey.Type = model.Type;
                    ApplyProlificSettings(model, ref survey);
                    break;
            }

            _surveys.InsertOne(survey);

            return id;
        }

        private void ApplyProlificSettings(Models.CreateSurveyModel model, ref Survey survey)
        {
            // Fix some settings based on type
            survey.OneTimeParticipants = true;
            survey.UseParticipantIdentifiers = true;

            // TODO: Validate type specific settings?

            // add the type specific settings
            _mapper.Map(model, survey);

            // TODO: add / amend a lookup record for this survey type
        }

        public int Create(Models.Survey survey, string? ownerId = null)
        {
            var entity = _mapper.Map<Survey>(survey);

            entity.Id = GetNextSurveyId();
            entity.Owner = ownerId;

            _surveys.InsertOne(entity);
            return entity.Id;
        }

        public void Delete(int id)
        {
            // Delete all Instance Event Logs
            _instances.Find(x => x.SurveyId == id)
                .Project(x => x.Id)
                .ToList()
                .ForEach(_events.Delete);

            // Delete all Instances
            _instances.DeleteMany(x => x.SurveyId == id);

            // Delete the Survey
            _surveys.DeleteOne(x => x.Id == id);
        }

        public bool Exists(int id)
            => _surveys.CountDocuments(x => x.Id == id) > 0;

        public SurveyAccessResult TestSurveyAccess(int id, string userId, bool allowOwnerless = false)
        {
            var survey = _surveys.Find(x => x.Id == id).SingleOrDefault();
            if (survey is null) return new(SurveyAccessStatus.NotFound);

            if (survey.Owner == userId) return new(SurveyAccessStatus.Owned);
            if (survey.Owner is null && allowOwnerless) return new(SurveyAccessStatus.Owned);

            return new(SurveyAccessStatus.AccessDenied);
        }


        public Models.Survey Find(int id) =>
            _mapper.Map<Models.Survey>(
                _surveys.Find(x => x.Id == id).SingleOrDefault());

        public List<Models.SurveySummary> List(string? userId = null, bool includeOwnerless = false)
        {
            var surveys = userId is null
                ? _surveys.Find(new BsonDocument()).ToList()
                : _surveys.Find(
                        x => x.Owner == userId ||
                        (includeOwnerless && x.Owner == null))
                    .ToList();

            var summaries = _mapper.Map<List<Models.SurveySummary>>(surveys);

            return summaries
                .Select(survey =>
                    _mapper.Map(_instances.Find(
                        instance => instance.SurveyId == survey.Id).ToList(),
                        survey))
                .ToList();
        }

        public void Update(Models.Survey survey) =>
            _surveys.FindOneAndReplace(
                x => x.Id == survey.Id,
                _mapper.Map<Survey>(survey));

        public void UpdateName(int id, string name) =>
            _surveys.UpdateOne(
                x => x.Id == id,
                Builders<Survey>.Update.Set(x => x.Name, name));
    }
}
