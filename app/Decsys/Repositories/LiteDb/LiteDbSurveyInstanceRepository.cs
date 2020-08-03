using AutoMapper;

using Decsys.Data;
using Decsys.Data.Entities;
using Decsys.Repositories.Contracts;
using Decsys.Services;

using LiteDB;

using System;
using System.Collections.Generic;

namespace Decsys.Repositories.LiteDb
{
    public class LiteDbSurveyInstanceRepository : ISurveyInstanceRepository
    {
        private readonly ILiteCollection<Survey> _surveys;
        private readonly ILiteCollection<SurveyInstance> _instances;

        private readonly IMapper _mapper;

        public LiteDbSurveyInstanceRepository(LiteDbFactory db, IMapper mapper)
        {
            _surveys = db.Surveys.GetCollection<Survey>(Collections.Surveys);
            _instances = db.Surveys.GetCollection<SurveyInstance>(Collections.SurveyInstances);
            _mapper = mapper;
        }

        public bool HasActiveInstance(int id) =>
            _instances.Exists(x => x.Survey.Id == id && x.Closed == null);

        public int Insert(Models.SurveyInstance instance) =>
            _instances.Insert(_mapper.Map<SurveyInstance>(instance));

        public Models.SurveyInstance Get(int id) =>
            _mapper.Map<Models.SurveyInstance>(
                _instances
                    .Include(x => x.Survey)
                    .Include(x => x.Survey.Pages)
                    .FindById(id));

        public IEnumerable<Models.SurveyInstance> List(int surveyId) =>
            _mapper.Map<IEnumerable<Models.SurveyInstance>>(
                _instances.Find(x => x.Survey.Id == surveyId));

        public void Close(int id)
        {
            var instance = _instances.FindById(id);
            instance.Closed = DateTimeOffset.UtcNow;
            _instances.Update(instance);
        }

        // TODO: blocked by EventLogs Repo
        //public void Import(IList<Models.SurveyInstanceResults<Models.ParticipantEvents>> instanceModels, int targetSurveyId)
        //{
        //    var instances = _db.Surveys.GetCollection<SurveyInstance>(Collections.SurveyInstances);
        //    var survey = _db.Surveys.GetCollection<Survey>(Collections.Surveys).FindById(targetSurveyId);

        //    foreach (var instanceModel in instanceModels)
        //    {
        //        var instance = _mapper.Map<SurveyInstance>(instanceModel);
        //        instance.Survey = survey;
        //        var instanceId = instances.Insert(instance);

        //        foreach (var participant in instanceModel.Participants)
        //        {
        //            var log = _db.InstanceEventLogs(instanceId).GetCollection<ParticipantEvent>(
        //            ParticipantEventService.GetCollectionName(participant.Id, _db.InstanceEventLogs(instanceId)));

        //            foreach (var e in participant.Events)
        //            {
        //                log.Insert(_mapper.Map<ParticipantEvent>(e));
        //            }
        //        }
        //    }
        //}
    }
}
