using System;
using System.Collections.Generic;
using AutoMapper;
using Decsys.Constants;
using Decsys.Data;
using Decsys.Data.Entities.LiteDb;
using Decsys.Repositories.Contracts;
using LiteDB;

namespace Decsys.Repositories.LiteDb
{
    public class LiteDbSurveyInstanceRepository : ISurveyInstanceRepository
    {
        private readonly ILiteCollection<SurveyInstance> _instances;
        private readonly IMapper _mapper;

        public LiteDbSurveyInstanceRepository(LiteDbFactory db, IMapper mapper)
        {
            _instances = db.Surveys.GetCollection<SurveyInstance>(Collections.SurveyInstances);
            _mapper = mapper;
        }

        public bool HasActiveInstance(int id) =>
            _instances.Exists(x => x.Survey.Id == id && x.Closed == null);

        public int Create(Models.SurveyInstance instance) =>
            _instances.Insert(_mapper.Map<SurveyInstance>(instance));

        public Models.SurveyInstance Find(int id) =>
            _mapper.Map<Models.SurveyInstance>(
                _instances
                    .Include(x => x.Survey)
                    .Include(x => x.Survey.Pages)
                    .FindById(id));

        public List<Models.SurveyInstance> List(int surveyId) =>
            _mapper.Map<List<Models.SurveyInstance>>(
                _instances.Find(x => x.Survey.Id == surveyId));

        public void Close(int id)
        {
            var instance = _instances.FindById(id);
            instance.Closed = DateTimeOffset.UtcNow;
            _instances.Update(instance);
        }

        public bool Exists(int id) => _instances.Exists(x => x.Id == id);
    }
}
