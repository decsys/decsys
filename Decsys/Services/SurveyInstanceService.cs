using Decsys.Data;
using Decsys.Data.Entities;
using LiteDB;
using System;
using System.Collections.Generic;

namespace Decsys.Services
{
    public class SurveyInstanceService
    {
        private readonly LiteDatabase _db;

        public SurveyInstanceService(LiteDatabase db)
        {
            _db = db;
        }

        public int Create(int surveyId)
        {
            if (!_db.GetCollection<Survey>(Collections.Surveys)
                    .Exists(x => x.Id == surveyId))
                throw new KeyNotFoundException();

            var instances = _db.GetCollection<SurveyInstance>(Collections.SurveyInstances);

            if (instances.Exists(x => x.Closed == null && x.Survey.Id == surveyId))
                throw new ArgumentException(
                    $"The Survey with the id '{surveyId}' currently has an active Survey Instance.",
                    nameof(surveyId));

            return instances.Insert(new SurveyInstance(surveyId));
        }

        public SurveyInstance Get(int surveyId, int instanceId) // TODO: Model
        {
            if (!_db.GetCollection<Survey>(Collections.Surveys)
                    .Exists(x => x.Id == surveyId))
                throw new KeyNotFoundException();

            var instance = _db.GetCollection<SurveyInstance>(Collections.SurveyInstances)
                .FindById(instanceId);

            if (instance.Survey.Id != surveyId) throw new KeyNotFoundException();

            return instance;
        }

        public IEnumerable<SurveyInstance> List(int surveyId) // TODO: Model
        {
            if (!_db.GetCollection<Survey>(Collections.Surveys)
                    .Exists(x => x.Id == surveyId))
                throw new KeyNotFoundException();

            return _db.GetCollection<SurveyInstance>(Collections.SurveyInstances)
                .Find(x => x.Survey.Id == surveyId);
        }

        public void Close(int surveyId, int instanceId)
        {
            if (!_db.GetCollection<Survey>(Collections.Surveys)
                    .Exists(x => x.Id == surveyId))
                throw new KeyNotFoundException();

            var instances = _db.GetCollection<SurveyInstance>(Collections.SurveyInstances);
            var instance = instances.FindById(instanceId);

            if (instance.Survey.Id != surveyId) throw new KeyNotFoundException();

            instance.Closed = DateTimeOffset.UtcNow;
            instances.Update(instance);
        }
    }
}
