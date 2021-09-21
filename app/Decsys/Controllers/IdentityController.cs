using System;
using System.Collections.Generic;
using System.Linq;

using Decsys.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Decsys.Controllers
{
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class IdentityController : ControllerBase
    {
        private readonly ParticipantEventService _events;
        private readonly SurveyInstanceService _instances;

        public IdentityController(ParticipantEventService events, SurveyInstanceService instances)
        {
            _events = events;
            _instances = instances;
        }

        [HttpPost("anonymous")]
        public string AnonymousId() => Guid.NewGuid().ToString();

        [HttpGet("{participantId}/{instanceId}/next")]
        public ActionResult<string> NextId(string participantId, int instanceId)
        {
            try
            {
                return _events.GetNextId(participantId, instanceId);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        /// <summary>
        /// <para>
        /// Checks if a user provided participant ID is valid for a Survey Instance
        /// and provides the currently correct ID to use (accounting for repeating surveys)
        /// </para>
        /// <para>
        /// <c>200</c> if valid, with a possibly modified version to use
        /// </para>
        /// <para>
        /// <c>404</c> if no valid id/instance found.
        /// </para>
        /// </summary>
        /// <param name="surveyId"></param>
        /// <param name="instanceId"></param>
        /// <param name="participantId"></param>
        /// <returns></returns>
        [HttpGet("validate/{surveyId}/{instanceId}/{participantId}")]
        public ActionResult<string> ValidateParticipantId(int surveyId, int instanceId, string participantId)
        {
            var instance = _instances.Get(surveyId, instanceId);

            if (instance is null) return NotFound();

            // if there are any valid id requirements, check the provided id is valid
            if (instance.ValidIdentifiers.Count > 0 &&
                !instance.ValidIdentifiers.Contains(participantId))
                return NotFound();

            // If valid, check we're using the correct version for repeatable surveys
            if (!instance.OneTimeParticipants)
            {
                if (instance.Survey.IsStudy)
                {
                    // need to check all child instances for an advanced participant id
                    List<string> numberedIds = new();

                    foreach(var childInstance in instance.Children)
                    {
                        var nextId = _events.GetNextId(participantId, childInstance.Id);

                        // we only care if it's got a number on the end
                        // which will be the case if it doesn't match the provided id
                        if (nextId != participantId)
                            numberedIds.Add(nextId);
                    }

                    if (numberedIds.Count > 0)
                    {
                        // numbered id's came back from the next id;
                        // each number is the count of times this participant id
                        // has taken the child instance in question
                        // so we can sum them to get our next id at a study level
                        int ParseVersionFromId(string id)
                            => int.Parse(id.Substring(id.LastIndexOf("-") + 1));

                        return $"{participantId}-{numberedIds.Sum(ParseVersionFromId)}";
                    } else
                    {
                        return participantId;
                    }
                }
                else
                {
                    return _events.GetNextId(participantId, instance.Id);
                }
            }

            return participantId;
        }
    }
}
