using System;
using System.Collections.Generic;
using System.Linq;

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
        private readonly ILiteCollection<Survey> _surveys;
        private readonly IMapper _mapper;

        public LiteDbSurveyInstanceRepository(LiteDbFactory db, IMapper mapper)
        {
            _instances = db.Surveys.GetCollection<SurveyInstance>(Collections.SurveyInstances);
            _surveys = db.Surveys.GetCollection<Survey>(Collections.Surveys);
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

            if (parent is not null)
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

        private Models.SurveyInstance? FindInstance(int id, Models.Survey? providedParentSurvey = null)
        {
            var instance = _instances
                .Include(x => x.Survey)
                .Include(x => x.Survey.Pages)
                .FindById(id);
            if (instance is null) return null;

            var model = _mapper.Map<Models.SurveyInstance>(instance);
            model.Survey.Parent = (providedParentSurvey?.Id == instance.Survey.ParentSurveyId)
                ? providedParentSurvey
                : _mapper.Map<Models.Survey>(
                    _surveys.Find(x => x.Id == instance.Survey.ParentSurveyId).Single());

            foreach (var childId in instance.ChildInstanceIds)
            {
                var child = FindInstance(childId, model.Survey);
                if (child is not null) model.Children.Add(child);
            }

            return model;
        }

        public Models.SurveyInstance? Find(int id) =>
            FindInstance(id);

        public List<Models.SurveyInstance> List(int surveyId)
        {
            var instances = _instances
                .Include(x => x.Survey)
                .Include(x => x.Survey.Pages)
                .Find(x => x.Survey.Id == surveyId)
                .ToList();

            return instances.ConvertAll(instance =>
            {
                var model = _mapper.Map<Models.SurveyInstance>(instance);
                model.Survey.Parent = instance.Survey.ParentSurveyId is not null
                    ? _mapper.Map<Models.Survey>(
                        _surveys.Find(x => x.Id == instance.Survey.ParentSurveyId).Single())
                    : null;

                foreach (var childId in instance.ChildInstanceIds)
                {
                    var child = FindInstance(childId, model.Survey);
                    if (child is not null) model.Children.Add(child);
                }
                return model;
            });
        }

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
