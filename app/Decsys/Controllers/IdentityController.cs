using System;
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

        public IdentityController(ParticipantEventService events)
        {
            _events = events;
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
    }
}
