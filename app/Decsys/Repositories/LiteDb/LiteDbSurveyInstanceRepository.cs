using System;
using System.Collections.Generic;

using AutoMapper;

using Decsys.Constants;
using Decsys.Data;
using Decsys.Data.Entities;
using Decsys.Data.Entities.LiteDb;
using Decsys.Repositories.Contracts;

using LiteDB;

namespace Decsys.Repositories.LiteDb
{
    public class LiteDbSurveyInstanceRepository : ISurveyInstanceRepository
    {
        private readonly ILiteCollection<SurveyInstance> _instances;
        private readonly ILiteCollection<ExternalLookup> _external;
        private readonly IMapper _mapper;

        public LiteDbSurveyInstanceRepository(LiteDbFactory db, IMapper mapper)
        {
            _instances = db.Surveys.GetCollection<SurveyInstance>(Collections.SurveyInstances);
            _external = db.Surveys.GetCollection<ExternalLookup>(Collections.ExternalLookup);
            _mapper = mapper;
        }

        public bool HasActiveInstance(int id) =>
            _instances.Exists(x => x.Survey.Id == id && x.Closed == null);

        public int Create(Models.SurveyInstance instance, int? parentInstanceId = null)
        {
            SurveyInstance? parent = null;
            if (parentInstanceId is not null)
                parent = _instances.FindOne(x => x.Id == parentInstanceId)
                    ?? throw new KeyNotFoundException(
                        $"Invalid Parent Instance with ID {parentInstanceId}");

            var id = _instances.Insert(_mapper.Map<SurveyInstance>(instance));

            if(parent is not null)
            {
                parent.ChildInstanceIds.Add(id);
                _instances.Update(parent);
            }

            // we always try and a update a lookup record
            // but no worries if none found
            var lookup = _external.FindOne(
                x => x.SurveyId == instance.Survey.Id);

            if (lookup is not null)
            {
                lookup.InstanceId = id;
                _external.Update(lookup);
            }

            return id;
        }

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

        public void Reactivate(int id)
        {
            var instance = _instances.FindById(id);
            instance.Closed = null;
            _instances.Update(instance);
        }
    }
}
