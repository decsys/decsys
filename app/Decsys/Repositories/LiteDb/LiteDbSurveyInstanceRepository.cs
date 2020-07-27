using AutoMapper;
using Decsys.Data;
using Decsys.Data.Entities;
using Decsys.Repositories.Contracts;
using LiteDB;
using System;
using System.Collections.Generic;

namespace Decsys.Repositories.LiteDb
{
    public class LiteDbSurveyInstanceRepository : ISurveyInstanceRepository
    {
        private readonly LiteDbFactory _db;
        private readonly IMapper _mapper;

        public LiteDbSurveyInstanceRepository(LiteDbFactory db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public int Create(int surveyId)
        {
            var surveys = _db.Surveys.GetCollection<Survey>(Collections.Surveys);
            if (!surveys.Exists(x => x.Id == surveyId))
                throw new KeyNotFoundException();

            var instances = _db.Surveys.GetCollection<SurveyInstance>(Collections.SurveyInstances);

            if (instances.Exists(x => x.Closed == null && x.Survey.Id == surveyId))
                throw new ArgumentException(
                    $"The Survey with the id '{surveyId}' currently has an active Survey Instance.",
                    nameof(surveyId));

            var survey = surveys.FindById(surveyId); // finally get the surey, now we definitely care

            var instance = new SurveyInstance(surveyId)
            {
                // Preserve the Survey Config at the time of this Instance launch
                OneTimeParticipants = survey.OneTimeParticipants,
                UseParticipantIdentifiers = survey.UseParticipantIdentifiers,
                ValidIdentifiers = survey.ValidIdentifiers
            };

            return instances.Insert(instance);
        }

        public Models.SurveyInstance Get(int surveyId, int instanceId)
        {
            if (!_db.Surveys.GetCollection<Survey>(Collections.Surveys)
                    .Exists(x => x.Id == surveyId))
                throw new KeyNotFoundException();

            var instance = _db.Surveys.GetCollection<SurveyInstance>(Collections.SurveyInstances)
                .FindById(instanceId);

            if (instance.Survey.Id != surveyId) throw new KeyNotFoundException();

            return _mapper.Map<Models.SurveyInstance>(instance);
        }


        public IEnumerable<Models.SurveyInstance> List(int surveyId)
        {
            if (!_db.Surveys.GetCollection<Survey>(Collections.Surveys)
                    .Exists(x => x.Id == surveyId))
                throw new KeyNotFoundException();

            return _mapper.Map<IEnumerable<Models.SurveyInstance>>(
                _db.Surveys.GetCollection<SurveyInstance>(Collections.SurveyInstances)
                    .Find(x => x.Survey.Id == surveyId));
        }

        public void Close(int surveyId, int instanceId)
        {
            if (!_db.Surveys.GetCollection<Survey>(Collections.Surveys)
                    .Exists(x => x.Id == surveyId))
                throw new KeyNotFoundException();

            var instances = _db.Surveys.GetCollection<SurveyInstance>(Collections.SurveyInstances);
            var instance = instances.FindById(instanceId);

            if (instance.Survey.Id != surveyId) throw new KeyNotFoundException();

            instance.Closed = DateTimeOffset.UtcNow;
            instances.Update(instance);
        }

        public void Import(IList<Models.SurveyInstanceResults<Models.ParticipantEvents>> instanceModels, int targetSurveyId)
        {
            var instances = _db.Surveys.GetCollection<SurveyInstance>(Collections.SurveyInstances);
            var survey = _db.Surveys.GetCollection<Survey>(Collections.Surveys).FindById(targetSurveyId);

            foreach (var instanceModel in instanceModels)
            {
                var instance = _mapper.Map<SurveyInstance>(instanceModel);
                instance.Survey = survey;
                var instanceId = instances.Insert(instance);

                foreach (var participant in instanceModel.Participants)
                {
                    var log = _db.InstanceEventLogs(instanceId).GetCollection<ParticipantEvent>(
                    LiteDbParticipantEventLogRepository.GetCollectionName(participant.Id, _db.InstanceEventLogs(instanceId)));

                    foreach (var e in participant.Events)
                    {
                        log.Insert(_mapper.Map<ParticipantEvent>(e));
                    }
                }
            }
        }
    }
}
