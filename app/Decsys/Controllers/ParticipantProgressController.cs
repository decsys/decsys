using Decsys.Constants;
using Decsys.Models;
using Decsys.Models.EventPayloads;
using Decsys.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Newtonsoft.Json.Linq;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Decsys.Models.Webhooks;

namespace Decsys.Controllers
{
    [ApiController]
    [Route("api/progress")]
    [AllowAnonymous] // TODO: perhaps restrict this to `client-app` (but no user) in future?
    public class ParticipantProgressController : ControllerBase
    {
        private readonly SurveyInstanceService _instances;
        private readonly ParticipantEventService _events;
        private readonly StudyAllocationService _random;
        private readonly WebhookService _webhooks;
        private readonly MathService _math;

        public ParticipantProgressController(
            SurveyInstanceService instances,
            ParticipantEventService events,
            StudyAllocationService random,
            WebhookService webhooks,
            MathService math)
        {
            _instances = instances;
            _events = events;
            _random = random;
            _webhooks = webhooks;
            _math = math;
        }

        /// <summary>
        /// Calculate a model of a Participant's progress in a given Survey based on logged events,
        /// return the Progress Model along with some of the fetched data used to calculate it.
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="instanceId"></param>
        /// <param name="participantId"></param>
        /// <returns></returns>
        private async Task<(ParticipantProgressModel progress, SurveyInstance instance, List<string>? pageOrder)>
            GetProgress(int surveyId, int instanceId, string? participantId, bool allowChildSurveys = false)
        {
            var instance = _instances.Get(surveyId, instanceId);
            if (instance is null || instance.Closed is not null) // TODO: differentiate between closed and non-existent instances?
                throw new KeyNotFoundException();

            // if we don't allow child progress updates (i.e. a GET request)
            // then pretend like we couldn't find the survey instance
            if (!allowChildSurveys && instance.Survey.Parent is not null)
                throw new KeyNotFoundException();

            // This is a starter for 10, these properties may conditionally change,
            // especially in Study / Child situations
            var progress = new ParticipantProgressModel()
            {
                SurveyId = surveyId,
                InstanceId = instanceId,
                ParticipantId = participantId,
                UseParticipantIdentifiers = instance.UseParticipantIdentifiers,
                PageCount = instance.Survey.IsStudy
                    ? -1 // Studies have 0 page count, but they're not meant to have pages, so this helps the frontend distinguish
                    : instance.Survey.Pages.Count,
                Settings = instance.Survey.Parent?.Settings ?? instance.Survey.Settings
            };

            // This might end up being a child Survey Instance
            var targetInstance = instance;

            // short circuit on empty surveys

            if (!instance.Survey.IsStudy && progress.PageCount == 0)
                return (progress, instance, null);

            bool hasCompleted = false;

            // If a participant id was specified, then we can get an existing progress record
            // based on stored participant events
            // otherwise its a new progress record
            if (progress.ParticipantId is not null)
            {
                var skipCompletionCheck = false;

                // For studies, we actually want the correct child survey for this participant
                if (instance.Survey.IsStudy)
                {
                    // Look up which survey/instance this participant entered
                    var allocatedInstance = _random.FindAllocatedInstance(instanceId, progress.ParticipantId);

                    // If they've not been allocated, then allocate them now
                    if(allocatedInstance is null)
                    {
                        allocatedInstance = await _random.AllocateNext(instanceId, progress.ParticipantId);
                        skipCompletionCheck = true; // we know they haven't completed, as they haven't been allocated!
                    }

                    targetInstance = allocatedInstance;
                    progress.SurveyId = targetInstance.Survey.Id;
                    progress.InstanceId = targetInstance.Id;
                    progress.PageCount = targetInstance.Survey.Pages.Count;

                    // short circuit on empty child Survey
                    if (progress.PageCount == 0) return (progress, targetInstance, null);
                }

                if (!skipCompletionCheck)
                {
                    // check if this participant has completed
                    hasCompleted = _events.Last(
                        progress.InstanceId,
                        progress.ParticipantId,
                        source: progress.SurveyId.ToString(),
                        EventTypes.SURVEY_COMPLETE) is not null;

                    if (hasCompleted)
                    {
                        // can the survey be taken repeatedly and are we responsible for generating an id?
                        if (!instance.OneTimeParticipants && !instance.UseParticipantIdentifiers)
                        {
                            // provide a new participant id for next run through
                            progress.NewParticipantId = Guid.NewGuid().ToString();

                            if (instance.Survey.IsStudy)
                            {
                                // a "new" participant should be freshly randomised into a target child Survey
                                // so revert these values to the parent Study
                                progress.SurveyId = surveyId;
                                progress.InstanceId = instanceId;
                            }
                        }
                    }
                }
            }
            // If no participant id provided, and users aren't expected to enter one
            // then we generate one here and now
            else if (!instance.UseParticipantIdentifiers)
            {
                progress.NewParticipantId = Guid.NewGuid().ToString();
            }
            // else
            // leave participant id and progress empty
            // so the frontend knows to interactively get an id
            // before requesting progress again

            // now we have a correct participant id (one way or another) and know the completed state
            // we can fetch / set progress accordingly

            /* Valid Progress matrix
             * 
             *   hasCompleted | ID provided | ID Generated | Output
             *   --------------------------------------------------
             *         N      |      Y      |       N      | Try Get existing progress - New progress if unsuccessful
             *         Y      |      Y      |       N      | No progress path - Survey complete and not repeatable / expects identifier entry
             *         N      |      N      |       N      | No progress path - Interactive ID entry required
             *         N      |      N      |       Y      | Send back new autogenerated ID with no progress yet (expect a second request with known id)
             *         Y      |      Y      |       Y      | Send back new autogenerated ID with no progress yet - Survey complete and repeatable but no progress yet (expect a second request with known id)
             */

            List<string> pageOrder = new();
            string? pageId = null;

            var tryFetchProgress = !hasCompleted && progress.ParticipantId is not null && progress.NewParticipantId is null;

            if (tryFetchProgress)
            {
                // We need to work out what progress information the participant has, if any.

                // The first thing recorded for a new participant is their randomised page order,
                // and we'll need that to determine their next page regardless
                var pageOrderEvent = _events.Last(
                    progress.InstanceId,
                    progress.ParticipantId!, // guaranteed as a condition of tryFetchProgress
                    progress.SurveyId.ToString(),
                    EventTypes.PAGE_RANDOMIZE);

                if (pageOrderEvent is null)
                {
                    // if they haven't had a page order generated, they are a new participant,
                    // and won't have any other progress events either

                    // So we'll generate their page order now
                    pageOrder = RandomizePageOrder(targetInstance.Survey.Pages);

                    // Log the Randomize event
                    _events.Log(
                        progress.InstanceId,
                        progress.NewParticipantId ?? progress.ParticipantId!, // we're guaranteed at least one of these; new is prioritised
                        new()
                        {
                            Type = EventTypes.PAGE_RANDOMIZE,
                            Source = progress.SurveyId.ToString(),
                            Timestamp = DateTimeOffset.UtcNow,
                            Payload = JObject.FromObject(new PageRandomizeEventPayload() { Order = pageOrder })
                        });

                    // Use the first page
                    pageId = pageOrder[0];

                    // check for last page (unlikely, but possible)
                    progress.IsLastPage = progress.PageCount == 1;
                }
                else
                {
                    // We have their page order, now we need to work out which page they are on

                    // This is either based on the last page they loaded,
                    // or the last page they submitted (i.e. requested a valid navigation from);
                    // whichever event is later, or exists.
                    // if none exists, they aren't brand new, but are on the first page.
                    var lastPageLoaded = _events.Last(progress.InstanceId, progress.ParticipantId!, EventTypes.PAGE_LOAD);
                    var lastNavigation = _events.Last(progress.InstanceId, progress.ParticipantId!, EventTypes.PAGE_NAVIGATION);
                    pageOrder = pageOrderEvent.Payload.ToObject<PageRandomizeEventPayload>()?.Order
                        ?? throw new InvalidOperationException("Participant Page Randomize Event contains invalid payload.");

                    // TODO: We could also provide latest response values recorded when loading pages for which responses have been logged!
                    // This will likely be desirable when page navigation is more flexible

                    // Last Navigation exists/is newer; try and use its target
                    if ((lastNavigation?.Timestamp ?? default) > (lastPageLoaded?.Timestamp ?? default))
                    {
                        pageId = lastNavigation?
                            .Payload.ToObject<PageNavigationEventPayload>()?
                            .TargetPageId; // Target Page Order might be null though
                    }

                    // Last Navigation null, older, or had no valid target
                    if (pageId is null) pageId = lastPageLoaded?.Source;

                    // neither event available; use First Page in the order
                    if (pageId is null) pageId = pageOrder.FirstOrDefault();

                    // still nothing?
                    if (pageId is null)
                        throw new InvalidOperationException(
                            $"Invalid Page Order Event for Participant {progress.ParticipantId}");
                }

                progress.Page = targetInstance.Survey.Pages.SingleOrDefault(p => p.Id == Guid.Parse(pageId!));
                if (progress.Page is null)
                    throw new InvalidOperationException(
                        $"Couldn't find next page for Participant {progress.ParticipantId}");

                progress.IsLastPage = progress.Page.Id.ToString() == pageOrder.Last();
            }

            return (progress, targetInstance, pageOrder);
        }

        /// <summary>
        /// <para>
        /// Request to progress the participant to a new page. The request is validated,
        /// and an updated Progress Model returned, which may or may not be the requested state, depending on validity.
        /// </para>
        /// <para>
        /// For example, just because a request to skip ahead 3 pages comes in, it won't be granted if the survey doesn't allow it
        /// and instead the returned Progress will reflect where the participant should actually go next.
        /// </para>
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="instanceId"></param>
        /// <param name="participantId"></param>
        /// <param name="requestedPageKey">
        ///     <para>
        ///     Accepted Page Keys:
        ///     </para>
        ///     <list type="bullet">
        ///         <item>`next` the next page in order</item>
        ///         <item>`prev`, `back`, `previous` the previous page in order(not currently valid as back navigation not yet supported</item>
        ///         <item>a page ID (Guid)</item>
        ///     </list>
        /// </param>
        /// <returns></returns>
        [HttpPost("{surveyId}/{instanceId}/{participantId}/{requestedPageKey}")]
        public async Task<ActionResult<ParticipantProgressModel>> RequestNavigation(
            int surveyId,
            int instanceId,
            string participantId,
            string requestedPageKey)
        {
            var (progress, instance, pageOrder) = await GetProgress(
                surveyId,
                instanceId,
                participantId,
                allowChildSurveys: true);

            // there's a bunch of situations in which we can't really advance progress
            // it should be assumed the frontend state will never allow requesting it
            // but for safety we should reject those states
            if (progress.ParticipantId is null ||
                progress.NewParticipantId is not null ||
                progress.Page is null ||
                pageOrder is null)
            {
                // Log that this request occurred anyway
                _events.Log(instance.Id, participantId, new()
                {
                    Type = EventTypes.PAGE_NAVIGATION,
                    Timestamp = DateTimeOffset.UtcNow,
                    Source = progress.Page?.Id.ToString() ?? "UNKNOWN",
                    Payload = JObject.FromObject(
                        new PageNavigationEventPayload(
                            requestedPageKey,
                            progress.Page?.Id.ToString()))
                });

                // TODO: should it break? or just use the unmodified progress?
                throw new InvalidOperationException(
                    $"{participantId} progress state doesn't allow further navigation");
            }

            //response mandatory check
            foreach (var component in progress.Page.Components)
            {
                if (!component.IsOptional && !BuiltInPageItems.IsBuiltIn(component.Type))
                {
                    var result = _events.Last(instance.Id, participantId, component.Id.ToString(), EventTypes.COMPONENT_RESULTS);

                    if (result is null)
                    {
                        // early return to keep the participant on the same page
                        // Log the request and its outcome
                        _events.Log(instance.Id, participantId, new()
                        {
                            Type = EventTypes.PAGE_NAVIGATION,
                            Timestamp = DateTimeOffset.UtcNow,
                            Source = progress.Page.Id.ToString(),
                            Payload = JObject.FromObject(
                                    new PageNavigationEventPayload(
                                        requestedPageKey,
                                        progress.Page.Id.ToString()))
                        });

                        return progress;
                    }
                }
            }

            // Currently, we never allow page skips or back navigation.
            // So if a specific page is requested, we should check that it's the next page in order
            // and our resulting progress should always be to the next page in order (or no page if complete)

            // Here's where we *would* validate keys in future
            // But since we don't currently record validity, and always return the next page
            // There's no different behaviour by key today
            //switch (requestedPageKey)
            //{
            //    case "prev":
            //    case "back":
            //    case "previous":
            //        break;
            //    case "next":
            //        break;
            //    default:
            //        // detect page id (Guid.Parse), or invalid string
            //}

            // to get the next page, we need the index of the current page in progress
            var currentPageId = progress.Page.Id;
            var iCurrentPage = pageOrder.IndexOf(progress.Page.Id.ToString());
            var iNextPage = iCurrentPage + 1;

            // if already flagged as last page, or iNextPage is out of range,
            // then set page to null to trigger Survey Complete behaviour
            if (iNextPage >= pageOrder.Count || progress.IsLastPage)
            {
                progress.Page = null;
                progress.IsLastPage = false;

                // log completion
                _events.Log(instance.Id, participantId, new()
                {
                    Type = EventTypes.SURVEY_COMPLETE,
                    Timestamp = DateTimeOffset.UtcNow,
                    Source = instance.Survey.Id.ToString(),
                    Payload = JObject.Parse("{}")
                });
            }
            else
            {
                progress.Page = instance.Survey.Pages.Single(p => p.Id.ToString() == pageOrder[iNextPage]);
                progress.IsLastPage = iNextPage >= pageOrder.Count - 1;
            }
            
            // Trigger webhook
            try
            {
                var summary = _events.ResultsSummary(instanceId, participantId);
                var eventType = new PageNavigation
                {
                    ResolvedPage = iNextPage,
                    SourcePage = iCurrentPage,
                };
                await _webhooks.Trigger(new PayloadModel(surveyId, instanceId, participantId, eventType, summary
                ));
            }
            catch (Exception e)
            {
                // ignored
            }

            // Log the request and its outcome
            _events.Log(instance.Id, participantId, new()
            {
                Type = EventTypes.PAGE_NAVIGATION,
                Timestamp = DateTimeOffset.UtcNow,
                Source = currentPageId.ToString(),
                Payload = JObject.FromObject(
                        new PageNavigationEventPayload(
                            requestedPageKey,
                            progress.Page?.Id.ToString()))
            });

            return progress;
        }

        /// <summary>
        /// Get progress in a Survey Instance for a given Participant
        /// (or provide a new ID for a new Participant with zero progress)
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="instanceId"></param>
        /// <param name="participantId"></param>
        /// <param name="participantId">Participant Id if known</param>
        /// <returns></returns>
        [HttpGet("{surveyId}/{instanceId}/{participantId?}")]
        public async Task<ActionResult<ParticipantProgressModel>> Get(int surveyId, int instanceId, string? participantId)
        {
            try
            {
                return (await GetProgress(
                    surveyId,
                    instanceId,
                    participantId,
                    allowChildSurveys: false)).progress;
            }
            catch (KeyNotFoundException)
            {
                return NotFound("An active Survey Instance could not be found for the external survey details provided.");
            }
        }

        /// <summary>
        /// Returns an ordered list of Page Id's having randomised groups of pages according to whether they are flagged for randomisation.
        /// </summary>
        /// <param name="pages">All the Pages in a survey, to produce a random order of</param>
        private List<string> RandomizePageOrder(List<Page> pages)
        {
            // We are randomizing the subgroups of random pages, and leaving fixed pages in position
            List<string> result = new();

            var a = pages.Aggregate(
                new List<string>(),
                (a, p) =>
                {
                    if (p.Randomize)
                    {
                        // can randomize;
                        // add to the accumulator for randomizing later
                        a.Add(p.Id.ToString());
                    }
                    else
                    {
                        // can't randomize;
                        // 1. randomize up to this point,
                        // 2. add this fixed item,
                        // 3. flush the acccumulator
                        if (a.Count > 0)
                        {
                            _math.Shuffle(ref a); // 1
                            result.AddRange(a); // 1b
                        }
                        result.Add(p.Id.ToString()); // 2
                        a = new(); // 3
                    }
                    return a;
                });

            // if we didn't end on a fixed item,
            // we'll need to handle whatever was left in the accumulator
            if (a.Count > 0)
            {
                _math.Shuffle(ref a); // 1
                result.AddRange(a); // 1b
            }

            return result;
        }
    }
}
