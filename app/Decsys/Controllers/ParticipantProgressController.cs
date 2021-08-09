using Decsys.Constants;
using Decsys.Models;
using Decsys.Models.EventPayloads;
using Decsys.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Newtonsoft.Json;
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

        private (int surveyId, int? instanceId) GetSurveyInstanceIds(string friendlyId, JObject externalParams)
        {
            // Lookup "External" Surveys based on parameters
            if (friendlyId == "ext")
            {
                var externalDetails = _surveys.LookupExternal(externalParams);
                return (externalDetails.SurveyId, externalDetails.InstanceId);
            }
            else // everything we need to know is in the friendly id :)
            {
                return InstanceIdService.Decode(friendlyId);
            }
        }

        /// <summary>
        /// Get progress in a Survey Instance for a given Participant
        /// (or provide a new ID for a new Participant with zero progress)
        /// </summary>
        /// <param name="friendlyId">Friendly Survey Identifier e.g. "bzb", or "ext" for external</param>
        /// <param name="participantId">Participant Id if known</param>
        /// <returns></returns>
        [HttpGet("{friendlyId}/{participantId}")]
        public ActionResult<ParticipantProgressModel> Get(string friendlyId, string? participantId, [FromBody] JObject externalParams)
        {
            try
            {
                // Get raw Survey and Instance Ids
                var (surveyId, tryInstanceId) = GetSurveyInstanceIds(friendlyId, externalParams);
                var instanceId = tryInstanceId ?? throw new KeyNotFoundException();

                var instance = _instances.Get(surveyId, instanceId);
                if (instance is null || instance.Closed is not null) // TODO: differentiate between closed and non-existent instances?
                    throw new KeyNotFoundException();

                var result = new ParticipantProgressModel()
                {
                    SurveyId = surveyId,
                    InstanceId = instanceId,
                    ParticipantId = participantId,
                    UseParticipantIdentifiers = instance.UseParticipantIdentifiers,
                    PageCount = instance.Survey.Pages.Count
                };

                // short circuit on empty surveys
                if (result.PageCount == 0) return Ok(result);

                bool hasCompleted = false;

                // If a participant id was specified, then we can get an existing progress record
                // based on stored participant events
                // otherwise its a new progress record
                if (result.ParticipantId is not null)
                {
                    // check if this participant has completed
                    hasCompleted = _events.Last(
                        instanceId,
                        result.ParticipantId,
                        source: surveyId.ToString(),
                        EventTypes.SURVEY_COMPLETE) is not null;

                    if (hasCompleted)
                    {
                        // can the survey be taken repeatedly?
                        if (!instance.OneTimeParticipants)
                        {
                            // provide a new participant id for next run through
                            result.NewParticipantId = instance.UseParticipantIdentifiers
                                ? _events.GetNextId(result.ParticipantId, instanceId)
                                : Guid.NewGuid().ToString();
                        }
                    }
                }
                // If no participant id provided, and users aren't expected to enter one
                // then we generate one here and now
                else if (!instance.UseParticipantIdentifiers)
                {
                    result.NewParticipantId = Guid.NewGuid().ToString();
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
                 *         Y      |      Y      |       N      | No progress path - Survey complete and not repeatable
                 *         N      |      N      |       N      | No progress path - Interactive ID entry required
                 *         N      |      N      |       Y      | New progress for autogenerated ID
                 *         Y      |      Y      |       Y      | New progress for server updated ID - Survey complete and repeatable
                 */

                var tryFetchProgress = !hasCompleted && result.ParticipantId is not null && result.NewParticipantId is null;
                var newProgress = result.NewParticipantId is not null;

                List<string> pageOrder = new();
                string? pageId = null;

                if (tryFetchProgress)
                {
                    // We need to work out what progress information the participant has, if any.

                    // The first thing recorded for a new participant is their randomised page order,
                    // and we'll need that to determine their next page regardless
                    var pageOrderEvent = _events.Last(
                        instanceId,
                        result.ParticipantId!, // guaranteed as a condition of tryFetchProgress
                        surveyId.ToString(),
                        EventTypes.PAGE_RANDOMIZE);

                    if (pageOrderEvent is null)
                    {
                        // if they haven't had a page order generated, they are a new participant,
                        // and won't have any other progress events either
                        newProgress = true;
                    }
                    else
                    {
                        // We have their page order, now we need to work out which page they are on

                        // This is either based on the last page they loaded,
                        // or the last page they submitted (i.e. requested a valid navigation from);
                        // whichever event is later, or exists.
                        // if none exists, they aren't brand new, but are on the first page.
                        var lastPageLoaded = _events.Last(instanceId, result.ParticipantId!, EventTypes.PAGE_LOAD);
                        var lastNavigation = _events.Last(instanceId, result.ParticipantId!, EventTypes.PAGE_NAVIGATION);
                        pageOrder = pageOrderEvent.Payload.ToObject<PageRandomizeEventPayload>().Order;

                        // TODO: We could also provide latest response values recorded when loading pages for which responses have been logged!
                        // This will likely be desirable when page navigation is more flexible

                        if (lastNavigation is null && lastPageLoaded is null) // neither event available; use First Page in the order
                        {
                            // PAGE_RANDOMIZE payload is a JSON array of Page Id's
                            pageId = pageOrder.FirstOrDefault();

                            if (pageId is null)
                                throw new InvalidOperationException(
                                    $"Invalid Page Order Event for Participant {result.ParticipantId}");
                        }
                        else if ((lastNavigation?.Timestamp ?? default) > (lastPageLoaded?.Timestamp ?? default)) // Last Navigation is newer; use its target
                        {
                            // if lastNavigation is greater, then we know it's not null
                            // since if it were default above, then either it'd equal default on the other side
                            // or be less than lastPageLoaded
                            var lastNavOrder = lastNavigation!.Payload.ToObject<PageNavigationEventPayload>().TargetPageOrder;

                            pageId = pageOrder[lastNavOrder];
                        }
                        else // Last Page Load is newer; use its source
                        {
                            // lastPageLoaded cannot be null here because the above condition is only false
                            // if it has a value and is therefore greater than lastNav (or default),
                            // or both are null, which is covered by the earlier condition
                            pageId = lastPageLoaded!.Source;
                        }
                    }
                }

                if (newProgress)
                {
                    // Randomize
                    pageOrder = RandomizePageOrder(instance.Survey.Pages);

                    // Log the Randomize event
                    _events.Log(
                        instanceId,
                        result.NewParticipantId ?? result.ParticipantId!, // we're guaranteed at least one of these; new is prioritised
                        new()
                        {
                            Type = EventTypes.PAGE_RANDOMIZE,
                            Source = instance.Survey.Id.ToString(),
                            Timestamp = DateTimeOffset.UtcNow,
                            Payload = JObject.FromObject(new PageRandomizeEventPayload() { Order = pageOrder })
                        });

                    // Use the first page
                    pageId = pageOrder[0];

                    // check for last page (unlikely, but possible)
                    result.IsLastPage = result.PageCount == 1;
                }

                if (tryFetchProgress || newProgress)
                {
                    result.Page = instance.Survey.Pages.SingleOrDefault(p => p.Id == Guid.Parse(pageId));
                    if (result.Page is null)
                        throw new InvalidOperationException(
                            $"Couldn't find next page for Participant {result.ParticipantId}");

                    result.IsLastPage = result.Page.Id.ToString() == pageOrder[pageOrder.Count];
                }

                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound("An active Survey instance could not be found for the external survey details provided.");
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
