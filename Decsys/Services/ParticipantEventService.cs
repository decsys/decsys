using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using AutoMapper;
using Decsys.Data;
using Decsys.Data.Entities;
using LiteDB;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Decsys.Services
{
    public class ParticipantEventService
    {
        private readonly LiteDatabase _db;
        private readonly IMapper _mapper;

        public ParticipantEventService(LiteDatabase db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        private string GetCollectionName(int instanceId, string participantId)
            => $"{Collections.EventLog}{instanceId}_{participantId}";

        /// <summary>
        /// Log a new event
        /// </summary>
        /// <param name="instanceId">ID of a Survey Isntance</param>
        /// <param name="participantId">Identifier for a Survey Instance Participant</param>
        /// <param name="e">An event model, containing the source and type of the event, and a payload</param>
        /// <exception cref="KeyNotFoundException">When the Survey Instance couldn't be found</exception>
        public void Log(int instanceId, string participantId, Models.ParticipantEvent e)
        {
            if (!_db.GetCollection<SurveyInstance>(
                    Collections.SurveyInstances)
                .Exists(x => x.Id == instanceId))
                throw new KeyNotFoundException("Survey Instance could not be found.");

            var log = _db.GetCollection<ParticipantEvent>(
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
            if (!_db.GetCollection<SurveyInstance>(
                    Collections.SurveyInstances)
                .Exists(x => x.Id == instanceId))
                throw new KeyNotFoundException("Survey Instance could not be found.");

            var log = _db.GetCollection<ParticipantEvent>(
                GetCollectionName(instanceId, participantId));

            return _mapper.Map<Models.ParticipantEvent>(
                log.Find(x => x.Source == source && x.Type == type)
                    .OrderByDescending(x => x.Timestamp)
                    .FirstOrDefault());
        }

        // TODO: Participant state? Flat Participant Results? Other...?
        public SurveyInstanceResultsSummary ResultsSummary(int instanceId)
        {
            var instance = _db.GetCollection<SurveyInstance>(
                Collections.SurveyInstances)
                    .Include(x => x.Survey)
                    .FindById(instanceId) ??
                throw new KeyNotFoundException("Survey Instance could not be found.");

            // Get all participant collections for this instance
            var logs = _db.GetCollectionNames()
                .Where(x => x.StartsWith($"{Collections.EventLog}{instanceId}_"))
                .ToList();

            // summarize each one
            var participants = new List<ParticipantResultsSummaryModel>();
            foreach (var collectionName in logs)
            {
                var participantId = collectionName.Split("_").Last();
                participants.Add(ParticipantResultsSummary(instance, participantId));
            }

            return new SurveyInstanceResultsSummary
            {
                Generated = DateTimeOffset.UtcNow,
                Instance = instance.Published,
                Survey = instance.Survey.Name,
                Participants = participants
            };
        }

        public ParticipantResultsSummaryModel ResultsSummary(int instanceId, string participantId)
        {
            var instance = _db.GetCollection<SurveyInstance>(
                Collections.SurveyInstances)
                    .Include(x => x.Survey)
                    .FindById(instanceId) ??
                throw new KeyNotFoundException("Survey Instance could not be found.");

            return ParticipantResultsSummary(instance, participantId);
        }

        private ParticipantResultsSummaryModel ParticipantResultsSummary(SurveyInstance instance, string participantId)
        {
            var log = _db.GetCollection<ParticipantEvent>(GetCollectionName(instance.Id, participantId));

            var orderLog = log.Find(x =>
                        x.Source == instance.Survey.Id.ToString()
                        && x.Type == EventTypes.PAGE_RANDOMIZE)
                    .OrderByDescending(x => x.Timestamp)
                    .FirstOrDefault();

            var order = ((JArray)JsonConvert.DeserializeObject<dynamic>(
                    LiteDB.JsonSerializer.Serialize(
                        orderLog.Payload,
                        false,
                        false))
                    .order)
                .ToObject<IList<string>>();

            var responses = new List<PageResponseSummaryModel>();

            foreach (var page in instance.Survey.Pages.OrderBy(x => x.Order))
            {
                var responseComponent = page.Components.Single( // find the one with the Capitalised Type.
                        x => x.Type != x.Type.ToLower(CultureInfo.InvariantCulture));
                var finalResponse = log.Find(x =>
                        x.Source == responseComponent.Id.ToString()
                        && x.Type == EventTypes.COMPONENT_RESULTS)
                    .OrderByDescending(x => x.Timestamp)
                    .FirstOrDefault();

                responses.Add(new PageResponseSummaryModel
                {
                    Page = page.Order,
                    ResponseType = responseComponent.Type,
                    PageLoad = log.Find(x =>
                        x.Source == page.Id.ToString()
                        && x.Type == EventTypes.PAGE_LOAD)
                    .OrderByDescending(x => x.Timestamp)
                    .FirstOrDefault().Timestamp,
                    ResponseRecorded = finalResponse?.Timestamp
                        ?? DateTimeOffset.MinValue, // TODO: not sure what the desired behaviour is here!
                    Response = finalResponse is null
                        ? new JObject()
                        : JObject.Parse(
                            LiteDB.JsonSerializer.Serialize(
                                finalResponse.Payload,
                                false,
                                false)),
                    Order = order.IndexOf(page.Id.ToString()) + 1
                });
            }

            return new ParticipantResultsSummaryModel
            {
                Id = participantId,
                Responses = responses
            };
        }
    }

    // TODO: Move these to their own files, you heathen!

    public static class EventTypes
    {
        public const string COMPONENT_RESULTS = "decsys.platform.COMPONENT_RESULTS";
        public const string PAGE_LOAD = "decsys.platform.PAGE_LOAD";
        public const string PAGE_RANDOMIZE = "decsys.platform.PAGE_RANDOMIZE";
    }

    /// <summary>
    /// An export model for the results data of a survey instance
    /// </summary>
    public class SurveyInstanceResultsSummary
    {
        /// <summary>
        /// A timestamp for when the summary was produced
        /// </summary>
        public DateTimeOffset Generated { get; set; }

        /// <summary>
        /// The timestamp which identifies the Survey Instance
        /// </summary>
        public DateTimeOffset Instance { get; set; }

        /// <summary>
        /// The name of the survey the instance (and therefore these results) belong to
        /// </summary>
        public string Survey { get; set; } = string.Empty;

        /// <summary>
        /// The instance participants and their survey responses
        /// </summary>
        public List<ParticipantResultsSummaryModel> Participants { get; set; } = new List<ParticipantResultsSummaryModel>();
    }

    /// <summary>
    /// An export model for a participant's response data in a survey instance.
    /// </summary>
    public class ParticipantResultsSummaryModel
    {
        /// <summary>
        /// The participant's identifier
        /// </summary>
        public string Id { get; set; } = string.Empty;

        /// <summary>
        /// The participant's reponse to each survey question
        /// </summary>
        public List<PageResponseSummaryModel> Responses { get; set; } = new List<PageResponseSummaryModel>();
    }

    /// <summary>
    /// An export model for a participant's response to a given question
    /// </summary>
    public class PageResponseSummaryModel
    {
        /// <summary>
        /// The canonical Page number from the survey configuration
        /// i.e. as the Admin sees it
        /// </summary>
        public int Page { get; set; }

        /// <summary>
        /// The question component type
        /// </summary>
        public string ResponseType { get; set; } = string.Empty;

        /// <summary>
        /// The question number the participant saw the question as
        /// </summary>
        public int Order { get; set; }

        /// <summary>
        /// The participant's response data
        /// </summary>
        public JObject Response { get; set; } = new JObject();

        /// <summary>
        /// A timestamp of when the question page fully loaded
        /// </summary>
        public DateTimeOffset PageLoad { get; set; }

        /// <summary>
        /// A timestamp of when the participant submitted their response
        /// </summary>
        public DateTimeOffset ResponseRecorded { get; set; }
    }
}
