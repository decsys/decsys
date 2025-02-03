using System;
using System.Collections.Generic;
using System.Linq;

using AutoMapper;

using Decsys.Constants;
using Decsys.Data;
using Decsys.Data.Entities.LiteDb;
using Decsys.Models.ExternalTypeSettings;
using Decsys.Models.Results;
using Decsys.Repositories.Contracts;

using LiteDB;


namespace Decsys.Repositories.LiteDb
{
    public class LiteDbSurveyRepository : ISurveyRepository
    {
        private readonly ILiteCollection<Survey> _surveys;
        private readonly ILiteCollection<SurveyInstance> _instances;
        private readonly ILiteCollection<ExternalLookup> _external;
        private readonly ILiteCollection<Folder> _folders;
        private readonly IMapper _mapper;
        private readonly IParticipantEventRepository _events;

        public LiteDbSurveyRepository(
            LiteDbFactory db,
            IParticipantEventRepository events,
            IMapper mapper)
        {
            _surveys = db.Surveys.GetCollection<Survey>(Collections.Surveys);
            _instances = db.Surveys.GetCollection<SurveyInstance>(Collections.SurveyInstances);
            _external = db.Surveys.GetCollection<ExternalLookup>(Collections.ExternalLookup);
            _folders = db.Surveys.GetCollection<Folder>(Collections.Folders);
            _mapper = mapper;
            _events = events;
        }

        public bool Exists(int id) =>
            _surveys.Exists(x => x.Id == id);

        public Models.Survey Find(int id)
        {
            var entity = _surveys.FindById(id);
            var survey = _mapper.Map<Models.Survey>(entity);
            if (entity.ParentSurveyId is not null)
                survey.Parent = _mapper.Map<Models.Survey>(
                    _surveys.FindById(entity.ParentSurveyId));

            return survey;
        }
        
        public Models.PagedSurveySummary List(string? userId = null, bool includeOwnerless = false, string? name = null, string view = "", string sortBy = SurveySortingKeys.Name, string direction = SurveySortingKeys.Direction, bool isStudy=false, bool canChangeStudy = false,int pageIndex = 0, int pageSize = 10)
        {
            // Fetch all surveys
            var surveys = _surveys.FindAll().ToList();
            var totalSurveys = surveys.Count();

            if (isStudy)
            {
                surveys = surveys.Where(x => x.IsStudy).ToList();
            }
            // Filter by name if specified
            if (!string.IsNullOrWhiteSpace(name))
            {
                surveys = surveys
                    .Where(x => x.Name != null && x.Name.Contains(name, StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            // Filter by view: unarchived, archived
            switch (view.ToLower())
            {
                case SurveyArchivedTypes.Unarchived:
                    surveys = surveys.Where(x => x.ArchivedDate == null).ToList();
                    break;
                case SurveyArchivedTypes.Archived:
                    surveys = surveys.Where(x => x.ArchivedDate != null).ToList();
                    break;
            }

            var summaries = _mapper.Map<List<Models.SurveySummary>>(surveys);

            // Sorting
            Func<Models.SurveySummary, object> sortCriteria = sortBy.ToLower() switch
            {
                SurveySortingKeys.Name => s => s.Name ?? "",
                SurveySortingKeys.Active => s => s.ActiveInstanceId ?? int.MinValue,
                SurveySortingKeys.RunCount => s => s.RunCount,
                SurveySortingKeys.Archived => s => s.ArchivedDate ?? DateTimeOffset.MinValue,
                _ => s => s.Name ?? ""
            };

            // Apply sorting
            summaries = direction.ToLower() == SurveySortingKeys.Direction
                ? summaries.OrderBy(sortCriteria).ToList()
                : summaries.OrderByDescending(sortCriteria).ToList();

            // Reusable enhancement
            Models.SurveySummary EnhanceSummary(Models.SurveySummary survey)
            {
                var instances = _instances
                    .Find(instance => instance.Survey.Id == survey.Id)
                    .OrderByDescending(x => x.Published)
                    .ToList();

                var summary = _mapper.Map(instances, survey);

                var latestInstanceId = instances.FirstOrDefault()?.Id;

                // Validate external link if necessary
                summary.HasInvalidExternalLink =
                    !string.IsNullOrWhiteSpace(summary.Type) &&
                    _external.Find(x =>
                            x.SurveyId == summary.Id &&
                            x.InstanceId == latestInstanceId)
                        .SingleOrDefault() is null;

                if (latestInstanceId.HasValue)
                    survey.ActiveInstanceParticipantCount =
                        _events.GetParticipantCount(latestInstanceId.Value);

                return summary;
            }

             summaries
                .ConvertAll(survey =>
                {
                    var summary = EnhanceSummary(survey);

                    // Get Children for studies
                    if (survey.IsStudy)
                    {
                        summary.Children = _mapper.Map<List<Models.SurveySummary>>(
                            _surveys.Find(x => x.ParentSurveyId == survey.Id).ToList());

                        // They also need enhancing
                        summary.Children = summary.Children.ConvertAll(EnhanceSummary);
                    }

                    return summary;
                });


            var pagedSurveys = summaries
                  .Skip(pageIndex * pageSize)
                  .Take(pageSize)
                  .ToList();

            return new Models.PagedSurveySummary
            {
                Items = pagedSurveys.Cast<Models.ISummaryItem>().ToList(),
                SurveyCount = (int)totalSurveys
            };        
        }

        private Models.PagedSurveySummary List(int? parentId = null)
        {
            var summaries = _mapper.Map<List<Models.SurveySummary>>(
                _surveys.Find(x => x.ParentSurveyId == parentId));

            // Reusable enhancement
            Models.SurveySummary EnhanceSummary(Models.SurveySummary survey)
            {
                var instances = _instances
                    .Find(instance =>
                        instance.Survey.Id == survey.Id)
                    .OrderByDescending(x => x.Published)
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

                if (latestInstanceId.HasValue)
                    survey.ActiveInstanceParticipantCount =
                        _events.GetParticipantCount(latestInstanceId.Value);
                
                return summary;
            }

            summaries
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
                });
                
            var totalSurveys = summaries.Count();
            
            return new Models.PagedSurveySummary
             {
                 Items = summaries.Cast<Models.ISummaryItem>().ToList(),
                 SurveyCount = (int)totalSurveys
             };
        }

        private Survey? GetParent(Models.CreateSurveyModel model)
        {
            Survey? parent = null;

            // Some validation
            if (model.ParentSurveyId is not null)
            {
                if (model.IsStudy)
                    throw new ArgumentException("A Study cannot belong to a parent", nameof(model));

                parent = _surveys.FindById(model.ParentSurveyId);

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

            var survey = new Survey { ParentSurveyId = parent?.Id, IsStudy = model.IsStudy };
            if (survey.IsStudy)
                survey.Name = "Untitled Study";
            if (!string.IsNullOrWhiteSpace(model.Name))
                survey.Name = model.Name;

            var lookup = HandleSurveyTypeCreation(model, ref survey);

            var surveyId = _surveys.Insert(survey);

            if (lookup is not null)
                CreateExternalLookup(lookup, survey);

            return surveyId;
        }

        private ExternalLookup? HandleSurveyTypeCreation(Models.CreateSurveyModel model, ref Survey survey)
        {
            survey.Type = model.Type;
            _mapper.Map(model, survey);

            // Handle type settings
            switch (model.Type)
            {
                case SurveyTypes.Prolific:
                    return HandleProlificSurveyCreation(model, ref survey);
                default:
                    return null;
            }
        }

        private ExternalLookup HandleProlificSurveyCreation(Models.CreateSurveyModel model, ref Survey survey)
        {
            // Fix some settings based on type
            survey.OneTimeParticipants = true;
            survey.UseParticipantIdentifiers = true;
            survey.ValidIdentifiers = new();

            // return a partially ready Lookup record
            // with Type specific properties,
            // to be completed after the survey is successfully inserted 
            return new(string.Empty, string.Empty, survey.Id)
            {
                ParticipantIdKey = "PROLIFIC_PID"
            };
        }

        private void CreateExternalLookup(ExternalLookup lookup, Survey survey)
        {
            // add / amend a lookup record for this survey type
            var existingLookup = string.IsNullOrEmpty(lookup.ExternalIdKey)
                ? _external.FindOne(x => x.SurveyId == survey.Id)
                : _external.FindOne(x =>
                    x.ExternalIdKey == lookup.ExternalIdKey &&
                    x.ExternalIdValue == lookup.ExternalIdValue);

            if (existingLookup is null)
            {
                lookup.SurveyId = survey.Id;
                _external.Insert(lookup);
            }
            else
            {
                existingLookup.SurveyId = survey.Id;
                existingLookup.InstanceId = null;
                _external.Update(existingLookup);
            }
        }

        public int Create(Models.Survey survey, Models.CreateSurveyModel model, string? ownerId = null)
        {
            var entity = _mapper.Map<Survey>(survey);

            entity.ParentSurveyId = model.ParentSurveyId;

            // Reset Type properties
            // when we map the model, these will be accurately restored 
            entity.Type = null;
            entity.Settings = new();

            // set this so that regardless of what pages
            // there are and what they were named
            // we start default name generation from a sensible point
            entity.PageCreationCounter = entity.Pages.Count;

            if (!string.IsNullOrWhiteSpace(model.Name)) entity.Name = model.Name;
            var lookup = HandleSurveyTypeCreation(model, ref entity);

            entity.Id = 0;

            var surveyId = _surveys.Insert(entity);

            if (lookup is not null)
                CreateExternalLookup(lookup, entity);

            return surveyId;
        }

        public void Delete(int id, string? parentFolderName)
        {

            // Delete all Instance Event Logs
            _instances.Find(x => x.Survey.Id == id)
                .Select(x => x.Id)
                .ToList()
                .ForEach(_events.Delete);

            // Delete all Instances
            _instances.DeleteMany(x => x.Survey.Id == id);

            // Delete any external lookup records
            _external.DeleteMany(x => x.SurveyId == id);

            // Delete the Survey
            _surveys.Delete(id);
        }

        public void UpdateName(int id, string name)
        {
            var survey = _surveys.FindById(id) ?? throw new KeyNotFoundException();
            survey.Name = name;
            _surveys.Update(survey);
        }

        public void Update(Models.Survey survey)
        {
            var entity = _mapper.Map<Survey>(survey);
            _surveys.Update(entity);
        }


        public SurveyAccessResult TestSurveyAccess(int id, string userId, bool allowOwnerless = false)
        {
            if (!Exists(id)) return new(SurveyAccessStatus.NotFound);
            return new(SurveyAccessStatus.Owned);
        }

        public Models.ExternalLookup LookupExternal(string? externalKey, string externalId)
            => _mapper.Map<Models.ExternalLookup>(
                _external.FindOne(
                    x => (externalKey == null && x.SurveyId.ToString() == externalId) ||
                    (x.ExternalIdKey == externalKey && x.ExternalIdValue == externalId)));

        public Models.PagedSurveySummary ListChildren(int parentId)
            => List(parentId);

        public void ArchiveSurvey(int id, string? ownerId)
        {
            var survey = _surveys.FindById(id) ?? throw new KeyNotFoundException($"Survey with ID {id} not found.");

            if (survey.ArchivedDate != null)
                throw new InvalidOperationException("This survey is already archived and cannot be archived again.");

            var activeInstances = _instances.Find(x => x.Survey.Id == id && x.Closed == null).ToList();
            if (activeInstances.Count != 0)
                throw new InvalidOperationException("Cannot archive the survey because there are active instances.");

            survey.ArchivedDate = DateTimeOffset.UtcNow;
            _surveys.Update(survey);
        }

        public void UnarchiveSurvey(int id, string? ownerId)
        {
            var survey = _surveys.FindById(id) ?? throw new KeyNotFoundException($"Survey with ID {id} not found.");

            if (survey.ArchivedDate == null)
                throw new InvalidOperationException("This survey is not archived");

            survey.ArchivedDate = null;
            _surveys.Update(survey);
        }

        public void SetParentFolder(int surveyId, string? newParentFolderName = null)
        {
            var survey = _surveys.FindById(surveyId) ?? throw new KeyNotFoundException($"Survey with ID {surveyId} not found.");

            if (survey.ParentFolderName is not null)
            {
                var existingParentFolder = _folders.FindOne(f => f.Name == survey.ParentFolderName);
                if (existingParentFolder != null)
                {
                    existingParentFolder.SurveyCount--;
                    _folders.Update(existingParentFolder);
                }
            }

            if (newParentFolderName != null)
            {
                var newParentFolder = _folders.FindOne(f => f.Name == newParentFolderName);
                if (newParentFolder == null)
                {
                    throw new KeyNotFoundException($"No folder found with Name {newParentFolder}");
                }
                survey.ParentFolderName = newParentFolderName;
                newParentFolder.SurveyCount++;
                _folders.Update(newParentFolder);
            }
            else
            {
                survey.ParentFolderName = null;
            }

            _surveys.Update(survey);
        }
    }
}
