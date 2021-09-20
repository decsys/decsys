﻿using System;
using System.Collections.Generic;
using System.Linq;

using AutoMapper;

using Decsys.Config;
using Decsys.Constants;
using Decsys.Data.Entities;
using Decsys.Data.Entities.Mongo;
using Decsys.Models.ExternalTypeSettings;
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
        private readonly IMongoCollection<ExternalLookup> _external;
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
            _external = db.GetCollection<ExternalLookup>(Collections.ExternalLookup);
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

        private Survey? GetParent(Models.CreateSurveyModel model)
        {
            Survey? parent = null;

            // Some validation
            if (model.ParentSurveyId is not null)
            {
                if (model.IsStudy)
                    throw new ArgumentException("A Study cannot belong to a parent", nameof(model));

                parent = _surveys.Find(x => x.Id == model.ParentSurveyId).SingleOrDefault();

                var parentFailureMessage = $"Can't create a Survey with Parent {model.ParentSurveyId}";

                if (parent is null)
                    throw new KeyNotFoundException(
                        $"{parentFailureMessage}: that Study could not be found.");

                if (!parent.IsStudy)
                    throw new ArgumentException(
                        $"{parentFailureMessage}: that Survey is not a Study and therefore cannot have children.");
            }
            return parent;
        }

        public int Create(Models.CreateSurveyModel model, string? ownerId = null)
        {
            var parent = GetParent(model);

            var id = GetNextSurveyId();

            var survey = new Survey
            {
                Id = id,
                Owner = ownerId,
                IsStudy = model.IsStudy,
                ParentSurveyId = parent?.Id
            };
            if (!string.IsNullOrWhiteSpace(model.Name))
                survey.Name = model.Name;

            HandleSurveyTypeCreation(model, ref survey);

            _surveys.InsertOne(survey);

            return id;
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
            _external.ReplaceOne(
                x => x.ExternalIdKey == externalKey &&
                    x.ExternalIdValue == settings.StudyId,
                new(externalKey, settings.StudyId, survey.Id)
                {
                    ParticipantIdKey = "PROLIFIC_PID"
                },
                new ReplaceOptions
                {
                    IsUpsert = true
                });
        }

        public int Create(Models.Survey survey, Models.CreateSurveyModel model, string? ownerId = null)
        {
            var entity = _mapper.Map<Survey>(survey);

            entity.ParentSurveyId = model.ParentSurveyId;

            if (!string.IsNullOrWhiteSpace(model.Name)) entity.Name = model.Name;

            entity.Id = GetNextSurveyId();
            entity.Owner = ownerId;

            // Reset Type properties
            // when we map the model, these will be accurately restored 
            entity.Type = null;
            entity.Settings = new();

            HandleSurveyTypeCreation(model, ref entity);

            _surveys.InsertOne(entity);
            return entity.Id;
        }

        public ExternalLookup LookupExternal(string externalKey, string externalId)
            => _external.Find(x => x.ExternalIdKey == externalKey &&
                x.ExternalIdValue == externalId).SingleOrDefault();

        public void Delete(int id)
        {
            // Delete all Instance Event Logs
            _instances.Find(x => x.SurveyId == id)
                .Project(x => x.Id)
                .ToList()
                .ForEach(_events.Delete);

            // Delete all Instances
            _instances.DeleteMany(x => x.SurveyId == id);

            // Delete any external lookup records
            _external.DeleteMany(x => x.SurveyId == id);

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


        public Models.Survey Find(int id)
        {
            var entity = _surveys.Find(x => x.Id == id).SingleOrDefault();
            var survey = _mapper.Map<Models.Survey>(entity);

            if (entity.ParentSurveyId is not null)
            {
                var parent = _surveys.Find(x => x.Id == entity.ParentSurveyId).SingleOrDefault();
                survey.Parent = _mapper.Map<Models.Survey>(parent);
            }

            return survey;
        }

        public List<Models.SurveySummary> List(string? userId = null, bool includeOwnerless = false)
            => List(null, userId, includeOwnerless);

        private List<Models.SurveySummary> List(int? parentId = null, string? userId = null, bool includeOwnerless = false)
        {
            var surveys = userId is null
                ? _surveys.Find(x => x.ParentSurveyId == parentId).ToList()
                : _surveys.Find(
                        x => x.ParentSurveyId == parentId &&
                        (x.Owner == userId ||
                        (includeOwnerless && x.Owner == null)))
                    .ToList();

            var summaries = _mapper.Map<List<Models.SurveySummary>>(surveys);

            // Reusable enhancement
            Models.SurveySummary EnhanceSummary(Models.SurveySummary survey)
            {
                var instances = _instances
                            .Find(instance =>
                                instance.SurveyId == survey.Id)
                            .SortByDescending(x => x.Published)
                            .ToList();

                var summary = _mapper.Map(instances,
                  survey);

                var latestInstanceId = instances.FirstOrDefault()?.Id;

                // validate external link if necessary
                summary.HasInvalidExternalLink =
                    !string.IsNullOrWhiteSpace(summary.Type) &&
                    _external.Find(x =>
                            x.SurveyId == summary.Id &&
                            x.InstanceId == latestInstanceId)
                        .SingleOrDefault() is null;

                return summary;
            }

            return summaries
                .ConvertAll(survey =>
                    {
                        var summary = EnhanceSummary(survey);

                        // Get Children for studies
                        if (survey.IsStudy)
                        {
                            summary.Children = _mapper.Map<List<Models.SurveySummary>>(
                                _surveys.Find(x => x.ParentSurveyId == survey.Id).ToList());

                            // they also need enhancing
                            summary.Children = summary.Children.ConvertAll(EnhanceSummary);
                        }

                        return summary;
                    })
;
        }

        public void Update(Models.Survey survey) =>
            _surveys.FindOneAndReplace(
                x => x.Id == survey.Id,
                _mapper.Map<Survey>(survey));

        public void UpdateName(int id, string name) =>
            _surveys.UpdateOne(
                x => x.Id == id,
                Builders<Survey>.Update.Set(x => x.Name, name));

        public List<Models.SurveySummary> ListChildren(int parentId)
            => List(parentId);
    }
}
