﻿using System;
using System.Collections.Generic;

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
        /// <param name="friendlyId"></param>
        /// <param name="participantId"></param>
        /// <returns></returns>
        [HttpGet("validate/{friendlyId}/{participantId}")]
        public ActionResult<string> ValidateParticipantId(string friendlyId, string participantId)
        {
            var (surveyId, instanceId) = InstanceIdService.Decode(friendlyId);
            var instance = _instances.Get(surveyId, instanceId);

            if (instance is null) return NotFound();

            // if there are any valid id requirements, check the provided id is valid
            if (instance.ValidIdentifiers.Count > 0 &&
                !instance.ValidIdentifiers.Contains(participantId))
                return NotFound();

            // If valid, check we're using the correct version for repeatable surveys
            if (!instance.OneTimeParticipants)
                return _events.GetNextId(participantId, instance.Id);

            return participantId;
        }
    }
}
