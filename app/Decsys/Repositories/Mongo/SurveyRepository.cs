using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;

using Decsys.Config;
using Decsys.Constants;
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
        private readonly IMongoCollection<Folder> _folders;
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
            _folders = db.GetCollection<Folder>(Collections.Folders);
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

            if (survey.IsStudy)
                survey.Name = "Untitled Study";
            if (!string.IsNullOrWhiteSpace(model.Name))
                survey.Name = model.Name;

            HandleSurveyTypeCreation(model, ref survey);

            _surveys.InsertOne(survey);

            return id;
        }

        private void HandleSurveyTypeCreation(Models.CreateSurveyModel model, ref Survey survey)
        {
            survey.Type = model.Type;

            // always map the model to get settings across
            _mapper.Map(model, survey);

            // Handle type settings
            switch (model.Type)
            {
                case SurveyTypes.Prolific:
                    HandleProlificSurveyCreation(model, ref survey);
                    break;
                default:
                    if (model.Type is not null)
                        throw new ArgumentException(
                            $"Uknown Survey Type: {model.Type}", nameof(model));
                    break;
            }
        }

        private void HandleProlificSurveyCreation(Models.CreateSurveyModel model, ref Survey survey)
        {
            // Fix some settings based on type
            survey.OneTimeParticipants = true;
            survey.UseParticipantIdentifiers = true;
            survey.ValidIdentifiers = new();

            var surveyId = survey.Id; // lambdas don't like using ref params

            // add / amend a lookup record for this survey type
            _external.ReplaceOne(
                x => x.SurveyId == surveyId,
                new(string.Empty, string.Empty, survey.Id)
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

            // set this so that regardless of what pages
            // there are and what they were named
            // we start default name generation from a sensible point
            entity.PageCreationCounter = entity.Pages.Count;

            // Reset Type properties
            // when we map the model, these will be accurately restored 
            entity.Type = null;
            entity.Settings = new();

            HandleSurveyTypeCreation(model, ref entity);

            _surveys.InsertOne(entity);
            return entity.Id;
        }

        public Models.ExternalLookup LookupExternal(string? externalKey, string externalId)
        {
            if (externalKey is null)
            {
                if (int.TryParse(externalId, out var surveyId))
                {
                    return _mapper.Map<Models.ExternalLookup>(
                    _external.Find(x => x.SurveyId == surveyId)
                    .SingleOrDefault());
                }
                else
                {
                    throw new ArgumentException(
                        $"If no {nameof(externalKey)} is specified, {nameof(externalId)} must be a valid integer",
                        nameof(externalId));
                }
            }
            else
            {
                return _mapper.Map<Models.ExternalLookup>(
                    _external.Find(x =>
                        x.ExternalIdKey == externalKey &&
                        x.ExternalIdValue == externalId)
                    .SingleOrDefault());
            }
        }

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

        public Models.PagedSurveySummary List(
            string? userId = null, 
            bool includeOwnerless = false,
            string? name = null,
            string view = SurveySortingKeys.Archived,
            string sortBy = SurveySortingKeys.Name,
            string direction = SurveySortingKeys.Direction,
            bool isStudy = false,
            bool canChangeStudy = false,
            int pageIndex = 0,
            int pageSize = 10)

            => List(null, userId, includeOwnerless, name, view, sortBy, direction, isStudy, canChangeStudy, pageIndex,pageSize);

        private Models.PagedSurveySummary List(
            int? parentId = null,
            string? userId = null,
            bool includeOwnerless = false,
            string? name = null,
            string view = SurveySortingKeys.Archived,
            string sortBy = SurveySortingKeys.Name,
            string direction = SurveySortingKeys.Direction,
            bool isStudy = false,
            bool canChangeStudy = false,
            int pageIndex = 0,
            int pageSize = 10
        )
        {
            // Filtering
            var surveys = userId is null
                ? _surveys.Find(x => x.ParentSurveyId == parentId).ToList()
                : _surveys.Find(
                    x => x.ParentSurveyId == parentId &&
                    (!isStudy || x.IsStudy == isStudy) &&
                    (x.Owner == userId || (includeOwnerless && x.Owner == null))
                ).ToList();

            var folders = _folders.Find(f => f.Owner == userId).ToList();

            if (!string.IsNullOrWhiteSpace(name))
            {
                surveys = surveys.Where(x => x.Name != null && x.Name.Contains(name, StringComparison.OrdinalIgnoreCase)).ToList();
                folders = folders.Where(x => x.Name != null && x.Name.Contains(name, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            if (userId != null)
            {
                switch (view)
                {
                    case SurveyArchivedTypes.Unarchived:
                        surveys = surveys.Where(x => x.ArchivedDate == null).ToList();
                        break;
                    case SurveyArchivedTypes.Archived:
                        surveys = surveys.Where(x => x.ArchivedDate != null).ToList();
                        break;                    
                }
            }
            
            var summaries = _mapper.Map<List<Models.SurveySummary>>(surveys);

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
            
            if (canChangeStudy)
            {
                summaries = summaries.Where(x => x.RunCount == 0).ToList();
            }

            var folderItems = folders
              .Select(folder => new Models.Folder
              {
                  Name = folder.Name,
                  SurveyCount = folder.SurveyCount,
                  IsFolder = true
              })
              .ToList<Models.ISummaryItem>(); 

            var sumarryItems = summaries
                .Select(summary => (Models.ISummaryItem)summary)
                .ToList();

            var items = sumarryItems.Concat(folderItems).ToList();

            // Sorting
            var sortedSummaries = SortSurveys(items, sortBy, direction);

            // Pagination
            var pagedSurveys = sortedSummaries
                .Skip((pageIndex) * pageSize)
                .Take(pageSize)
                .ToList();
            
            // Count Surveys
           
            var baseFilter = Builders<Survey>.Filter.Empty;

            // Non Study Surveys
            baseFilter &= Builders<Survey>.Filter.Where(x => x.ParentSurveyId == null);
            baseFilter &= Builders<Survey>.Filter.Where(x => x.IsStudy == false);

            if (userId != null)
            {
                var userFilter = Builders<Survey>.Filter.Where(x => x.Owner == userId);
                if (includeOwnerless)
                {
                    var ownerlessFilter = Builders<Survey>.Filter.Where(x => x.Owner == null);
                    userFilter = Builders<Survey>.Filter.Or(userFilter, ownerlessFilter);
                }
                baseFilter &= userFilter;
            }
            
            if (!string.IsNullOrWhiteSpace(name))
            {
                var nameFilter = Builders<Survey>.Filter.Regex(x => x.Name, new MongoDB.Bson.BsonRegularExpression(name, "i"));
                baseFilter &= nameFilter;
            }
            
            if (view == SurveyArchivedTypes.Unarchived)
            {
                var unarchivedFilter = Builders<Survey>.Filter.Where(x => x.ArchivedDate == null);
                baseFilter &= unarchivedFilter;
            }
            else if (view == SurveyArchivedTypes.Archived)
            {
                var archivedFilter = Builders<Survey>.Filter.Where(x => x.ArchivedDate != null);
                baseFilter &= archivedFilter;
            }

            var surveyCount = _surveys.CountDocuments(baseFilter);
            
            return new Models.PagedSurveySummary
            {
                Items = pagedSurveys,
                SurveyCount = (int)surveyCount ,
                StudyCount = summaries.Count(s => s.IsStudy is true),
                FolderCount = folderItems.Count()
            };
        }
        
        public void Update(Models.Survey survey)
        {
            var entity = _surveys.Find(x => x.Id == survey.Id).SingleOrDefault()
                ?? throw new KeyNotFoundException();

            var updated = _mapper.Map(survey, entity);

            _surveys.ReplaceOne(x => x.Id == survey.Id, updated);
        }

        public void UpdateName(int id, string name) =>
            _surveys.UpdateOne(
                x => x.Id == id,
                Builders<Survey>.Update.Set(x => x.Name, name));

        public Models.PagedSurveySummary ListChildren(int parentId)
            => List(parentId);

        public void ArchiveSurvey(int id, string? userId)
        {
            var survey = _surveys.Find(x => x.Id == id).SingleOrDefault() ?? throw new KeyNotFoundException($"Survey with ID {id} not found.");

            if (survey.Owner != userId)
                throw new UnauthorizedAccessException("Only the owner can archive this survey.");

            if (survey.ArchivedDate != null)
                throw new InvalidOperationException("This survey is already archived and cannot be archived again.");

            var activeInstances = _instances.Find(x => x.SurveyId == id && x.Closed == null).ToList();
            if (activeInstances.Count != 0)
                throw new InvalidOperationException("Cannot archive the survey because there are active instances.");


            var update = Builders<Survey>.Update.Set(x => x.ArchivedDate, DateTimeOffset.UtcNow);
            _surveys.UpdateOne(x => x.Id == id, update);
        }

        public void UnarchiveSurvey(int id, string? userId)
        {
            var survey = _surveys.Find(x => x.Id == id).SingleOrDefault() ?? throw new KeyNotFoundException($"Survey with ID {id} not found.");

            if (survey.Owner != userId)
                throw new UnauthorizedAccessException("Only the owner can unarchive this survey.");

            if (survey.ArchivedDate == null)
                throw new InvalidOperationException("This survey is not archived.");

            // Unarchive the survey by setting ArchivedDate to null
            var update = Builders<Survey>.Update.Set(x => x.ArchivedDate, null);
            _surveys.UpdateOne(x => x.Id == id, update);
        }

        private List<Models.ISummaryItem> SortSurveys(List<Models.ISummaryItem> surveys, string sortBy, string direction)
        {
            var folders = surveys.OfType<Models.Folder>().Cast<Models.ISummaryItem>().ToList();
            var surveySummaries = surveys.OfType<Models.SurveySummary>().Cast<Models.ISummaryItem>().ToList();

            IEnumerable<Models.ISummaryItem> sortedSurveys;

            bool isAscending = direction == "up";

            switch (sortBy)
            {
                case SurveySortingKeys.Name:
                    sortedSurveys = isAscending
                        ? surveys.OrderBy(s => s.Name)
                        : surveys.OrderByDescending(s => s.Name);
                    break;
                case SurveySortingKeys.Active:
                    sortedSurveys = folders.Concat(
                        isAscending
                        ? surveySummaries.OrderBy(s => ((Models.SurveySummary)s).ActiveInstanceId ?? int.MinValue)
                        : surveySummaries.OrderByDescending(s => ((Models.SurveySummary)s).ActiveInstanceId ?? int.MinValue));
                    break;
                case SurveySortingKeys.RunCount:
                    sortedSurveys = folders.Concat(
                        isAscending
                        ? surveySummaries.OrderBy(s => ((Models.SurveySummary)s).RunCount)
                        : surveySummaries.OrderByDescending(s => ((Models.SurveySummary)s).RunCount));
                    break;
                case SurveySortingKeys.Archived:
                    sortedSurveys = folders.Concat(
                        isAscending
                        ? surveySummaries.OrderBy(s => ((Models.SurveySummary)s).ArchivedDate ?? DateTimeOffset.MinValue)
                        : surveySummaries.OrderByDescending(s => ((Models.SurveySummary)s).ArchivedDate ?? DateTimeOffset.MinValue));
                    break;
                default:
                    sortedSurveys = folders
                        .OrderBy(f => f.Name)
                        .Concat(
                            isAscending
                            ? surveySummaries.OrderBy(s => s.Name)
                            : surveySummaries.OrderByDescending(s => s.Name));
                    break;
            }

            return sortedSurveys.ToList();
        }


        public void SetParentFolder(int surveyId, string? newParentFolderName = null)
        {
            var survey = _surveys.Find(x => x.Id == surveyId).SingleOrDefault();
            if (survey == null)
            {
                throw new KeyNotFoundException($"No survey found with ID {surveyId}");
            }

            var originalParentFolderName = survey.ParentFolderName; 

            if (newParentFolderName != null)
            {
                var parentFolder = _folders.Find(f => f.Name == newParentFolderName).SingleOrDefault();
                if (parentFolder == null)
                {
                    throw new KeyNotFoundException($"No folder found with ID {newParentFolderName}");
                }

                survey.ParentFolderName = newParentFolderName;
                parentFolder.SurveyCount++;
                _folders.ReplaceOne(f => f.Name == newParentFolderName, parentFolder);

                if (originalParentFolderName != null && originalParentFolderName != newParentFolderName)
                {
                    var originalParentFolder = _folders.Find(f => f.Name == originalParentFolderName).SingleOrDefault();
                    if (originalParentFolder != null)
                    {
                        originalParentFolder.SurveyCount--;
                        _folders.ReplaceOne(f => f.Name == originalParentFolderName, originalParentFolder);
                    }
                }
            }
            else
            {
                survey.ParentFolderName = null;

                if (originalParentFolderName != null)
                {
                    var originalParentFolder = _folders.Find(f => f.Name == originalParentFolderName).SingleOrDefault();
                    if (originalParentFolder != null)
                    {
                        originalParentFolder.SurveyCount--;
                        _folders.ReplaceOne(f => f.Name == originalParentFolderName, originalParentFolder);
                    }
                }
            }

            _surveys.ReplaceOne(x => x.Id == surveyId, survey);
        }

    }
}
