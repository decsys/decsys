using AutoMapper;
using Decsys.Data;
using Decsys.Data.Entities;
using Decsys.Mapping;
using LiteDB;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace Decsys.Services
{
    public class ParticipantEventService
    {
        private readonly LiteDbFactory _db;
        private readonly IMapper _mapper;

        public ParticipantEventService(LiteDbFactory db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public static string GetCollectionName(string participantId, LiteDatabase db)
        {
            var lookupId = db
                .GetCollection<EventLogLookup>(Collections.EventLogLookup)
                .FindOne(x => x.ParticipantId == participantId)?.Id;

            if (lookupId is null)
            {
                lookupId = db
                    .GetCollection<EventLogLookup>(Collections.EventLogLookup)
                    .Insert(new EventLogLookup { ParticipantId = participantId });
            }

            return $"{Collections.EventLog}{lookupId}";
        }

        public string GetCollectionName(int instanceId, string participantId)
            => GetCollectionName(participantId, _db.InstanceEventLogs(instanceId));

        public string GetParticipantId(int instanceId, string collectionName)
            => _db.InstanceEventLogs(instanceId)
                .GetCollection<EventLogLookup>(Collections.EventLogLookup)
                .FindOne(x => x.Id.ToString() == collectionName.Substring(1))?
                .ParticipantId
            ?? throw new KeyNotFoundException(
                $"Couldn't find the requested logs collection (id: {collectionName}) for the specified Survey Instance (id: {instanceId})");

        private IEnumerable<Models.ParticipantEvent> _List(int instanceId, string participantId)
        {
            var log = _db.InstanceEventLogs(instanceId)
                .GetCollection<ParticipantEvent>(
                    GetCollectionName(instanceId, participantId));

            return _mapper.Map<IEnumerable<Models.ParticipantEvent>>(
                log.FindAll().OrderBy(x => x.Timestamp));
        }

        /// <summary>
        /// For a given Participant ID and Instance ID, get the next
        /// Unique Participant ID to use for that Instance.
        /// 
        /// e.g. if Participant "Bob" has completed Instance 1 seven times,
        /// the next Unique ID for "Bob" will be "Bob_7"
        /// </summary>
        /// <param name="participantId"></param>
        /// <param name="instanceId"></param>
        /// <returns></returns>
        public string GetNextId(string participantId, int instanceId)
        {
            if (!_db.Surveys.GetCollection<SurveyInstance>(
                    Collections.SurveyInstances)
                .Exists(x => x.Id == instanceId))
                throw new KeyNotFoundException("Survey Instance could not be found.");

            var logCollections = _db.InstanceEventLogs(instanceId)
                .GetCollection<EventLogLookup>(Collections.EventLogLookup)
                .Find(x => x.ParticipantId.StartsWith(participantId))
                .OrderByDescending(x => x.ParticipantId)
                .ToList();

            var latestLog = logCollections.FirstOrDefault();
            if (latestLog is null) return participantId;

            var log = _db.InstanceEventLogs(instanceId).GetCollection<ParticipantEvent>(latestLog.Id.ToString());
            return log.Find(x => x.Type == EventTypes.SURVEY_COMPLETE).Any()
                ? $"{participantId}-{logCollections.Count}"
                : latestLog.ParticipantId;
        }

        public IEnumerable<Models.ParticipantEvent> List(int instanceId, string participantId)
        {
            if (!_db.Surveys.GetCollection<SurveyInstance>(
                    Collections.SurveyInstances)
                .Exists(x => x.Id == instanceId))
                throw new KeyNotFoundException("Survey Instance could not be found.");

            return _List(instanceId, participantId);
        }

        public Models.SurveyInstanceResults<Models.ParticipantEvents> Results(int instanceId)
        {
            var instance = _db.Surveys.GetCollection<SurveyInstance>(
                Collections.SurveyInstances)
                    .Include(x => x.Survey)
                    .FindById(instanceId) ??
                throw new KeyNotFoundException("Survey Instance could not be found.");

            // Get all participant collections for this instance
            var logs = GetAllParticipantLogs(instanceId);

            // Add each one
            var participants = logs
                .Select(collectionName =>
                {
                    var participantId = GetParticipantId(instanceId, collectionName);
                    return new Models.ParticipantEvents(participantId)
                    {
                        Events = _List(instanceId, participantId).ToList()
                    };
                })
                .ToList();

            var result = _mapper.Map<Models.SurveyInstanceResults<Models.ParticipantEvents>>(instance);
            result.Participants = participants;

            return result;
        }

        /// <summary>
        /// Log a new event
        /// </summary>
        /// <param name="instanceId">ID of a Survey Isntance</param>
        /// <param name="participantId">Identifier for a Survey Instance Participant</param>
        /// <param name="e">An event model, containing the source and type of the event, and a payload</param>
        /// <exception cref="KeyNotFoundException">When the Survey Instance couldn't be found</exception>
        public void Log(int instanceId, string participantId, Models.ParticipantEvent e)
        {
            if (!_db.Surveys.GetCollection<SurveyInstance>(
                    Collections.SurveyInstances)
                .Exists(x => x.Id == instanceId))
                throw new KeyNotFoundException("Survey Instance could not be found.");

            var log = _db.InstanceEventLogs(instanceId)
                .GetCollection<ParticipantEvent>(
                    GetCollectionName(instanceId, participantId));

            log.Insert(_mapper.Map<ParticipantEvent>(e));
        }

        /// <summary>
        /// Get the most recent log entry for the given parameters
        /// </summary>
        /// <param name="instanceId">ID of a Survey Instance</param>
        /// <param name="participantId">Identifier for a Survey Instance Participant</param>
        /// <param name="source">Source of the event (e.g. component id)</param>
        /// <param name="type">Type of the event (e.g. Results)</param>
        /// <returns>The Event Log entry, or null if there isn't one matching the criteria.</returns>
        /// <exception cref="KeyNotFoundException">When the Survey Instance couldn't be found</exception>
        public Models.ParticipantEvent Last(int instanceId, string participantId, string source, string type)
        {
            if (!_db.Surveys.GetCollection<SurveyInstance>(
                    Collections.SurveyInstances)
                .Exists(x => x.Id == instanceId))
                throw new KeyNotFoundException("Survey Instance could not be found.");

            var log = _db.InstanceEventLogs(instanceId)
                .GetCollection<ParticipantEvent>(
                    GetCollectionName(instanceId, participantId));

            return _mapper.Map<Models.ParticipantEvent>(
                log.Find(x => x.Source == source && x.Type == type)
                    .OrderByDescending(x => x.Timestamp)
                    .FirstOrDefault());
        }

        /// <summary>
        /// Get the most recent log entry for the given parameters
        /// </summary>
        /// <param name="instanceId">ID of a Survey Instance</param>
        /// <param name="participantId">Identifier for a Survey Instance Participant</param>
        /// <param name="type">Type of the event (e.g. Results)</param>
        /// <returns>The Event Log entry, or null if there isn't one matching the criteria.</returns>
        /// <exception cref="KeyNotFoundException">When the Survey Instance couldn't be found</exception>
        public Models.ParticipantEvent Last(int instanceId, string participantId, string type)
        {
            if (!_db.Surveys.GetCollection<SurveyInstance>(
                    Collections.SurveyInstances)
                .Exists(x => x.Id == instanceId))
                throw new KeyNotFoundException("Survey Instance could not be found.");

            var log = _db.InstanceEventLogs(instanceId)
                .GetCollection<ParticipantEvent>(
                    GetCollectionName(instanceId, participantId));

            return _mapper.Map<Models.ParticipantEvent>(
                log.Find(x => x.Type == type)
                    .OrderByDescending(x => x.Timestamp)
                    .FirstOrDefault());
        }

        public Models.SurveyInstanceResults<Models.ParticipantResultsSummary> ResultsSummary(int instanceId)
        {
            var instance = _db.Surveys.GetCollection<SurveyInstance>(
                Collections.SurveyInstances)
                    .Include(x => x.Survey)
                    .FindById(instanceId) ??
                throw new KeyNotFoundException("Survey Instance could not be found.");

            // Get all participant collections for this instance
            var logs = GetAllParticipantLogs(instanceId);

            // summarize each one
            var participants = logs
                .Select(collectionName =>
                    ParticipantResultsSummary(instance, GetParticipantId(instanceId, collectionName)))
                .ToList();

            var result = _mapper.Map<Models.SurveyInstanceResults<Models.ParticipantResultsSummary>>(instance);
            result.Participants = participants;

            return result;
        }

        /// <summary>
        /// Get all participant collections for this instance
        /// </summary>
        /// <param name="instanceId"></param>
        /// <returns></returns>
        private List<string> GetAllParticipantLogs(int instanceId)
        {
            return _db.InstanceEventLogs(instanceId)
                .GetCollectionNames()
                .Where(x => x.StartsWith(Collections.EventLog))
                .ToList();
        }

        public Models.ParticipantResultsSummary ResultsSummary(int instanceId, string participantId)
        {
            var instance = _db.Surveys.GetCollection<SurveyInstance>(
                Collections.SurveyInstances)
                    .Include(x => x.Survey)
                    .FindById(instanceId) ??
                throw new KeyNotFoundException("Survey Instance could not be found.");

            return ParticipantResultsSummary(instance, participantId);
        }

        private Models.ParticipantResultsSummary ParticipantResultsSummary(Models.SurveyInstance instance, string participantId)
        {
            var resultsSummary = new Models.ParticipantResultsSummary(participantId);

            var log = _db.InstanceEventLogs(instance.Id)
                .GetCollection<ParticipantEvent>(
                    GetCollectionName(instance.Id, participantId));

            var orderLog = log.Find(x =>
                        x.Source == instance.Survey.Id.ToString()
                        && x.Type == EventTypes.PAGE_RANDOMIZE)
                    .OrderByDescending(x => x.Timestamp)
                    .FirstOrDefault();
            if (orderLog is null)
            {
                resultsSummary.Responses = new List<Models.PageResponseSummary>();
                return resultsSummary;
            }

            var order = ((JArray)
                    ((dynamic)BsonJObjectConverter.Convert(orderLog.Payload))
                    .order)
                .ToObject<IList<string>>();

            var responses = new List<Models.PageResponseSummary>();

            foreach (var page in instance.Survey.Pages.OrderBy(x => x.Order))
            {
                var responseComponent = page.Components.SingleOrDefault( // find the one with the Capitalised Type.
                        x => x.Type != x.Type.ToLower(CultureInfo.InvariantCulture));
                if (responseComponent is null) continue; // we don't care about pages without responses

                var finalResponse = log.Find(x =>
                        x.Source == responseComponent.Id.ToString()
                        && x.Type == EventTypes.COMPONENT_RESULTS)
                    .OrderByDescending(x => x.Timestamp)
                    .FirstOrDefault();
                var pageLoadEvent = log.Find(x =>
                        x.Source == page.Id.ToString()
                        && x.Type == EventTypes.PAGE_LOAD)
                    .OrderByDescending(x => x.Timestamp)
                    .FirstOrDefault();

                // don't try to add responses for pages we've never visited.
                // e.g. if the survey is still in progress
                if (pageLoadEvent is null) continue;

                responses.Add(new Models.PageResponseSummary
                {
                    Page = page.Order,
                    ResponseType = responseComponent.Type,
                    PageLoad = pageLoadEvent.Timestamp,
                    ResponseRecorded = finalResponse?.Timestamp
                        ?? DateTimeOffset.MinValue, // TODO: not sure what the desired behaviour is here!
                    Response = finalResponse is null
                        ? null
                        : BsonJObjectConverter.Convert(finalResponse.Payload),
                    Order = order.IndexOf(page.Id.ToString()) + 1
                });
            }

            resultsSummary.Responses = responses;
            return resultsSummary;
        }
    }
}
