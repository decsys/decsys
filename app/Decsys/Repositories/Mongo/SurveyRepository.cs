using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Decsys.Config;
using Decsys.Constants;
using Decsys.Data.Entities.Mongo;
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
        private readonly IMapper _mapper;

        public SurveyRepository(
            IOptions<HostedDbSettings> config,
            IMongoClient mongo,
            IMapper mapper)
        {
            var db = mongo.GetDatabase(config.Value.DatabaseName);
            _surveys = db.GetCollection<Survey>(Collections.Surveys);
            _instances = db.GetCollection<SurveyInstance>(Collections.SurveyInstances);

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

        public int Create(string? name = null)
        {
            var id = GetNextSurveyId();

            var survey = new Survey { Id = id };
            if (!string.IsNullOrWhiteSpace(name))
                survey.Name = name;

            _surveys.InsertOne(survey);

            return id;
        }

        public int Create(Models.Survey survey)
        {
            survey.Id = GetNextSurveyId();
            _surveys.InsertOne(_mapper.Map<Survey>(survey));
            return survey.Id;
        }

        public void Delete(int id)
        {
            _instances.DeleteMany(x => x.SurveyId == id);
            _surveys.DeleteOne(x => x.Id == id);
        }

        public bool Exists(int id)
            => _surveys.CountDocuments(x => x.Id == id) > 0;

        public Models.Survey Find(int id) =>
            _mapper.Map<Models.Survey>(
                _surveys.Find(x => x.Id == id).SingleOrDefault());

        public List<Models.SurveySummary> List()
        {
            var summaries = _mapper.Map<List<Models.SurveySummary>>(
                _surveys.Find(new BsonDocument()).ToList());

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
