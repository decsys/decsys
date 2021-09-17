﻿using Decsys.Constants;
using Decsys.Models;
using Decsys.Models.EventPayloads;
using Decsys.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Newtonsoft.Json.Linq;

using System;
using System.Collections.Generic;
using System.Linq;

namespace Decsys.Controllers
{
    [ApiController]
    [Route("api/progress")]
    [AllowAnonymous] // TODO: perhaps restrict this to `client-app` (but no user) in future?
    public class ParticipantProgressController : ControllerBase
    {
        private Random _random = new();

        private readonly SurveyService _surveys;
        private readonly SurveyInstanceService _instances;
        private readonly ParticipantEventService _events;

        public ParticipantProgressController(
            SurveyService surveys,
            SurveyInstanceService instances,
            ParticipantEventService events)
        {
            _surveys = surveys;
            _instances = instances;
            _events = events;
        }

        /// <summary>
        /// Calculate a model of a Participant's progress in a given Survey based on logged events,
        /// return the Progress Model along with some of the fetched data used to calculate it.
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="instanceId"></param>
        /// <param name="participantId"></param>
        /// <returns></returns>
        private (ParticipantProgressModel progress, SurveyInstance instance, List<string>? pageOrder)
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
                PageCount = instance.Survey.Pages.Count,
                Settings = instance.Survey.Parent?.Settings ?? instance.Survey.Settings
            };

            // short circuit on empty surveys
            if (!instance.Survey.IsStudy && progress.PageCount == 0)
                return (progress, instance, null);

            bool hasCompleted = false;

            // If a participant id was specified, then we can get an existing progress record
            // based on stored participant events
            // otherwise its a new progress record
            if (progress.ParticipantId is not null)
            {
                // For studies, we actually want the correct child survey for this participant
                if (instance.Survey.IsStudy)
                {
                    // TODO: Look up which survey/instance this participant entered
                    // progress.InstanceId =
                    // progress.SurveyId =

                    // TODO: handle if they have not yet been entered into a survey?
                    // i.e. randomise them into one and update study instance state
                    // this path also allows us to shortcut hasCompleted to false ;)
                    // TODO: writes shouldn't occur in what if mode :)
                }

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

            // This might end up being a child Survey Instance
            var targetInstance = instance;
            if (tryFetchProgress)
            {
                // We need to work out what progress information the participant has, if any.

                // get target instance for studies
                if (instance.Survey.IsStudy)
                {
                    // Progress IDs were updated earlier, if we have a participant id
                    targetInstance = _instances.Get(progress.SurveyId, progress.InstanceId);
                    progress.PageCount = targetInstance.Survey.Pages.Count;

                    // short circuit on empty child Survey
                    if (progress.PageCount == 0) return (progress, targetInstance, null);
                }

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
                    pageOrder = pageOrderEvent.Payload.ToObject<PageRandomizeEventPayload>().Order;

                    // TODO: We could also provide latest response values recorded when loading pages for which responses have been logged!
                    // This will likely be desirable when page navigation is more flexible

                    // Last Navigation exists/is newer; try and use its target
                    if ((lastNavigation?.Timestamp ?? default) > (lastPageLoaded?.Timestamp ?? default))
                    {
                        pageId = lastNavigation?
                            .Payload.ToObject<PageNavigationEventPayload>()
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
        public ActionResult<ParticipantProgressModel> RequestNavigation(
            int surveyId,
            int instanceId,
            string participantId,
            string requestedPageKey)
        {
            var (progress, instance, pageOrder) = GetProgress(surveyId, instanceId, participantId, allowChildSurveys: true);

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

            // TODO: confirm that mandatory response items have had responses recorded before leaving the current page!

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
        public ActionResult<ParticipantProgressModel> Get(int surveyId, int instanceId, string? participantId)
        {
            try
            {
                return GetProgress(
                    surveyId,
                    instanceId,
                    participantId,
                    allowChildSurveys: false).progress;
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
                            Shuffle(ref a); // 1
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
                Shuffle(ref a); // 1
                result.AddRange(a); // 1b
            }

            return result;
        }

        /// <summary>
        /// randomly reorder a List in place
        /// </summary>
        private void Shuffle<T>(ref List<T> items)
        {
            for (var i = items.Count - 1; i > 0; i--)
            {
                int j = _random.Next(0, i + 1);
                var itemJ = items[j];
                items[j] = items[i];
                items[i] = itemJ;
            }
        }
    }
}
