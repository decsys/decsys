using AutoMapper;
using Decsys.Constants;
using Decsys.Models;
using Decsys.Models.EventPayloads;
using Decsys.Repositories.Contracts;
using Newtonsoft.Json.Linq;

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

            return _events.List(instanceId, participantId: participantId);
        }


        public SurveyInstanceResults<ParticipantEvents> Results(int instanceId)
        {
            var instance = _instances.Find(instanceId) ??
                           throw new KeyNotFoundException("Survey Instance could not be found.");

            var participants = _events
                .ListLogs(instanceId)
                .ConvertAll(eventLogCollection =>
                {
                    var id = _events.GetParticipantId(instanceId, eventLogCollection);
                    return new ParticipantEvents(id)
                    {
                        Events = _events.List(instanceId, participantId: id)
                    };
                });

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

            var participants = _events
                .ListLogs(instanceId)
                .ConvertAll(participantId => 
                    ParticipantResultsSummary(
                        instance,
                        _events.GetParticipantId(instanceId, participantId)));
            
            var result = _mapper.Map<SurveyInstanceResults<ParticipantResultsSummary>>(instance);
            result.Participants = participants;
           
            result.ResponsePages = instance.Survey.Pages
                .OrderBy(page => page.Order)
                .Where(page => page.Components.Any(
                    pageItem => !BuiltInPageItems.IsBuiltIn(pageItem.Type)))
                .Select(page => (page.Order, page.Id))
                .ToList();
            
            return result;
        }

        public ParticipantResultsSummary ResultsSummary(int instanceId, string participantId)
        {
            var instance = _instances.Find(instanceId) ??
                           throw new KeyNotFoundException("Survey Instance could not be found.");

            return ParticipantResultsSummary(instance, participantId);
        }

        private ParticipantResultsSummary ParticipantResultsSummary(
            SurveyInstance instance,
            string participantId)
        {
            var events = _events.List(instance.Id, participantId, null);

            var firstPageLoad = events.FirstOrDefault(x => x.Type == EventTypes.PAGE_LOAD);
            
            var resultsSummary = new ParticipantResultsSummary(participantId)
            {
                Responses = new List<PageResponseSummary>(),
                SurveyStarted = firstPageLoad?.Timestamp
            };

            var orderEvent = events.LastOrDefault(x =>
                x.Type == EventTypes.PAGE_RANDOMIZE &&
                x.Source == instance.Survey.Id.ToString());
            if (orderEvent is null) return resultsSummary;
            
            var order = orderEvent.Payload.ToObject<PageRandomizeEventPayload>()?.Order;
            if (order is null) return resultsSummary;

            foreach (var page in instance.Survey.Pages.OrderBy(x => x.Order))
            {
                var responseComponent =
                    page.Components.SingleOrDefault( // find the one that's not a built in content item
                        x => !BuiltInPageItems.IsBuiltIn(x.Type));
                if (responseComponent is null) continue; // we don't care about pages without responses

                var finalResponse = events.LastOrDefault(x =>
                    x.Type == EventTypes.COMPONENT_RESULTS &&
                    x.Source == responseComponent.Id.ToString());

                var pageLoadEvent =
                    events.LastOrDefault(x =>
                        x.Type == EventTypes.PAGE_LOAD &&
                        x.Source == page.Id.ToString());

                // don't try to add responses for pages we've never visited.
                // e.g. if the survey is still in progress
                if (pageLoadEvent is null) continue;

                // try and get the item marked as a Question Item
                var questionItem = page.Components.SingleOrDefault(
                    x => x.IsQuestionItem);

                // If there isn't one (should only occur in older surveys),
                // get the first content item (i.e. first built in)
                if (questionItem is null)
                    questionItem = page.Components.FirstOrDefault(
                        x => BuiltInPageItems.IsBuiltIn(x.Type));

                // If there's an item ,try and get content from it, else null
                string? questionContent = null;
                if (questionItem is not null)
                {
                    var contentKey = BuiltInPageItems.Metadata(questionItem.Type)?.QuestionContent;
                    if (contentKey is not null)
                    {
                        questionContent = (string?)questionItem.Params.GetValue(contentKey) ?? string.Empty;
                    }
                }

                var response = new PageResponseSummary
                {
                    Page = page.Order,
                    PageName = page.Name,
                    Question = questionContent,
                    ResponseType = responseComponent.Type,
                    PageLoad = pageLoadEvent.Timestamp,
                    ResponseRecorded = finalResponse?.Timestamp
                                       ?? DateTimeOffset.MinValue, // TODO: not sure what the desired behaviour is here!
                    Response = finalResponse?.Payload,
                    Order = order.IndexOf(page.Id.ToString()) + 1,
                    IsOptional = responseComponent.IsOptional,
                };

                // If it looks like we haven't recorded a response, even though the page loaded
                // check if we have also left the page without a response, and have therefore skipped it
                if (response.Response is null)
                {
                    // This is the event for *leaving* this page; we can use it to calculate skipped pages
                    var pageNavEvent = events.LastOrDefault(x =>
                        x.Type == EventTypes.PAGE_NAVIGATION &&
                        x.Source == page.Id.ToString());

                    // only consider skipped if leaving was after loading;
                    // we may have returned to answer it!
                    // e.g. by the nav request being denied, or back navigation
                    if (pageNavEvent?.Timestamp > pageLoadEvent.Timestamp)
                    {
                        // Set the response value to an empty object,
                        // to indicate that we are explicitly recording NO response,
                        // rather than not recording any response.
                        response.Response = JObject.Parse("{}");
                    }
                }

                resultsSummary.Responses.Add(response);
            }
            
            return resultsSummary;
        }

        /// <summary>
        /// Get a page response summary for the given parameters 
        /// </summary>
        /// <param name="instanceId">ID of a Survey Instance</param>
        /// <param name="participantId">Identifier for a Survey Instance Participant</param>
        /// <param name="pageNumber">Page number to filter by.</param>
        /// <returns>The Page Response summary, or null if there isn't one matching the criteria.</returns>
        /// <exception cref="KeyNotFoundException">When the Survey Instance couldn't be found</exception>
        public PageResponseSummary? PageResponseSummary(int instanceId, string participantId, Guid pageId)
        {
            var instance = _instances.Find(instanceId) ??
                           throw new KeyNotFoundException("Survey Instance could not be found.");
            
            // Set the instance pages to only include the desired page
            var page = instance.Survey.Pages.Find(x => x.Id == pageId);
            if (page is not null)
            {
                instance.Survey.Pages = new List<Page>() { page };
            }
            else
            {
                instance.Survey.Pages.Clear();
            }

            return ParticipantResultsSummary(instance, participantId).Responses.SingleOrDefault();
        }
        
    }
}
