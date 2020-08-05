using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

using AutoMapper;

using Decsys.Constants;
using Decsys.Mapping;
using Decsys.Models;
using Decsys.Repositories.Contracts;

using LiteDB;

namespace Decsys.Services
{
    public class ParticipantEventService
    {
        private readonly IParticipantEventRepository _events;
        private readonly ISurveyInstanceRepository _instances;
        private readonly IMapper _mapper;

        public ParticipantEventService(
            IParticipantEventRepository events,
            ISurveyInstanceRepository instances,
            IMapper mapper)
        {
            _events = events;
            _instances = instances;
            _mapper = mapper;
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
        public string GetNextId(string participantId, int instanceId)
        {
            if (!_instances.Exists(instanceId))
                throw new KeyNotFoundException("Survey Instance could not be found.");

            return _events.NextParticipantId(instanceId, participantId);
        }

        /// <summary>
        /// List all Events for a Participant
        /// </summary>
        /// <param name="instanceId">ID of the Instance the Participant is in</param>
        /// <param name="participantId">ID of the Participant to list Events for</param>
        /// <returns></returns>
        public IEnumerable<ParticipantEvent> List(int instanceId, string participantId)
        {
            if (!_instances.Exists(instanceId))
                throw new KeyNotFoundException("Survey Instance could not be found.");

            return _events.List(instanceId, participantId);
        }


        public SurveyInstanceResults<ParticipantEvents> Results(int instanceId)
        {
            var instance = _instances.Find(instanceId) ??
                throw new KeyNotFoundException("Survey Instance could not be found.");

            var participants = _events.List(instanceId)
                .Select(log =>
                    new ParticipantEvents(log.Key)
                    {
                        Events = log.Value
                    })
                .ToList();

            var result = _mapper.Map<SurveyInstanceResults<ParticipantEvents>>(instance);
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
        public void Log(int instanceId, string participantId, ParticipantEvent e)
        {
            if (!_instances.Exists(instanceId))
                throw new KeyNotFoundException("Survey Instance could not be found.");

            _events.Create(instanceId, participantId, e);
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
        public ParticipantEvent? Last(int instanceId, string participantId, string source, string type)
        {
            if (!_instances.Exists(instanceId))
                throw new KeyNotFoundException("Survey Instance could not be found.");

            return FindLast(instanceId, participantId, source, type);
        }

        /// <summary>
        /// Get the most recent log entry for the given parameters
        /// </summary>
        /// <param name="instanceId">ID of a Survey Instance</param>
        /// <param name="participantId">Identifier for a Survey Instance Participant</param>
        /// <param name="type">Type of the event (e.g. Results)</param>
        /// <returns>The Event Log entry, or null if there isn't one matching the criteria.</returns>
        /// <exception cref="KeyNotFoundException">When the Survey Instance couldn't be found</exception>
        public ParticipantEvent? Last(int instanceId, string participantId, string type)
        {
            if (!_instances.Exists(instanceId))
                throw new KeyNotFoundException("Survey Instance could not be found.");

            return FindLast(instanceId, participantId, source: null, type);
        }

        private ParticipantEvent? FindLast(int instanceId, string participantId, string? source, string? type)
            => _events.List(instanceId, participantId, source, type).LastOrDefault();

        public SurveyInstanceResults<ParticipantResultsSummary> ResultsSummary(int instanceId)
        {
            var instance = _instances.Find(instanceId) ??
                throw new KeyNotFoundException("Survey Instance could not be found.");

            // summarize each one
            var participants = _events
                .List(instanceId).Keys
                .Select(participantId =>
                    ParticipantResultsSummary(instance, participantId))
                .ToList();

            var result = _mapper.Map<SurveyInstanceResults<ParticipantResultsSummary>>(instance);
            result.Participants = participants;

            return result;
        }

        public ParticipantResultsSummary ResultsSummary(int instanceId, string participantId)
        {
            var instance = _instances.Find(instanceId) ??
                throw new KeyNotFoundException("Survey Instance could not be found.");

            return ParticipantResultsSummary(instance, participantId);
        }

        private ParticipantResultsSummary ParticipantResultsSummary(SurveyInstance instance, string participantId)
        {
            var resultsSummary = new ParticipantResultsSummary(participantId)
            {
                Responses = new List<PageResponseSummary>()
            };

            var orderEvent = FindLast(
                    instance.Id,
                    participantId,
                    instance.Survey.Id.ToString(),
                    EventTypes.PAGE_RANDOMIZE);
            if (orderEvent is null) return resultsSummary;

            var order = ((dynamic)orderEvent.Payload)
                .order
                .ToObject<IList<string>>();

            foreach (var page in instance.Survey.Pages.OrderBy(x => x.Order))
            {
                var responseComponent = page.Components.SingleOrDefault( // find the one with the Capitalised Type.
                        x => x.Type != x.Type.ToLower(CultureInfo.InvariantCulture));
                if (responseComponent is null) continue; // we don't care about pages without responses

                var finalResponse = FindLast(
                    instance.Id, participantId,
                    responseComponent.Id.ToString(),
                    EventTypes.COMPONENT_RESULTS);

                var pageLoadEvent = FindLast(
                    instance.Id, participantId,
                    page.Id.ToString(),
                    EventTypes.PAGE_LOAD);

                // don't try to add responses for pages we've never visited.
                // e.g. if the survey is still in progress
                if (pageLoadEvent is null) continue;

                resultsSummary.Responses.Add(new PageResponseSummary
                {
                    Page = page.Order,
                    ResponseType = responseComponent.Type,
                    PageLoad = pageLoadEvent.Timestamp,
                    ResponseRecorded = finalResponse?.Timestamp
                        ?? DateTimeOffset.MinValue, // TODO: not sure what the desired behaviour is here!
                    Response = finalResponse?.Payload,
                    Order = order.IndexOf(page.Id.ToString()) + 1
                });
            }

            return resultsSummary;
        }
    }
}
