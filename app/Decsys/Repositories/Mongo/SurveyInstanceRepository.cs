using System;
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
    public class SurveyInstanceRepository : ISurveyInstanceRepository
    {
        private readonly IMongoCollection<Survey> _surveys;
        private readonly IMongoCollection<SurveyInstance> _instances;
        private readonly IMapper _mapper;

        public SurveyInstanceRepository(
            IOptions<HostedDbSettings> config,
            IMongoClient mongo,
            IMapper mapper)
        {
            var db = mongo.GetDatabase(config.Value.DatabaseName);
            _surveys = db.GetCollection<Survey>(Collections.Surveys);
            _instances = db.GetCollection<SurveyInstance>(Collections.SurveyInstances);
            _mapper = mapper;
        }

        public void Close(int instanceId) =>
            _instances.UpdateOne(
                x => x.Id == instanceId,
                Builders<SurveyInstance>.Update.Set(
                    x => x.Closed,
                    DateTimeOffset.UtcNow));

        private int GetNextSurveyInstanceId()
        {
            // mongo has no integer id generator
            // so we set integer id's at insert
            // TODO: this has the same issue as LiteDb
            // in that it will restart from 1
            // if all records are deleted
            var lastId = _instances.Find(new BsonDocument())
                .SortByDescending(x => x.Id)
                .FirstOrDefault()?
                .Id ?? 0;

            return ++lastId;
        }

        public int Create(Models.SurveyInstance instance)
        {
            instance.Id = GetNextSurveyInstanceId();
            _instances.InsertOne(_mapper.Map<SurveyInstance>(instance));
            return instance.Id;
        }

        public bool Exists(int id)
            => _instances.CountDocuments(x => x.Id == id) > 0;

        public Models.SurveyInstance? Find(int id)
        {
            var instance = _instances.Find(x => x.Id == id).SingleOrDefault();
            if (instance is null) return null;

            var survey = _surveys.Find(x => x.Id == instance.SurveyId).Single();

            var model = _mapper.Map<Models.SurveyInstance>(instance);
            model.Survey = _mapper.Map<Models.Survey>(survey);

            return model;
        }

        public bool HasActiveInstance(int surveyId)
            => _instances.CountDocuments(
                    x => x.SurveyId == surveyId && x.Closed == null)
                > 0;

        public List<Models.SurveyInstance> List(int surveyId)
        {
            var surveys = new Dictionary<int, Models.Survey>();
            var instances = _instances.Find(new BsonDocument()).ToList();
            return instances.Select(instance =>
            {
                // make sure the dictionary has the survey, but only fetch it once
                if (!surveys.ContainsKey(instance.SurveyId))
                {
                    surveys[instance.SurveyId] = _mapper.Map<Models.Survey>(
                        _surveys.Find(x => x.Id == instance.SurveyId).Single());
                }

                var model = _mapper.Map<Models.SurveyInstance>(instance);
                model.Survey = surveys[instance.SurveyId];
                return model;
            }).ToList();
        }
    }
}
