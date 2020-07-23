using System.Collections.Generic;
using Decsys.Models;
using Decsys.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Swashbuckle.AspNetCore.Annotations;

namespace Decsys.Controllers
{
    [Route("api/log/{instanceId}/{participantId}")]
    public class ParticipantEventsController : ControllerBase
    {
        private readonly ParticipantEventService _participantEvents;

        public ParticipantEventsController(ParticipantEventService participantEvents)
        {
            _participantEvents = participantEvents;
        }

        [HttpGet("{source}/{type}")]
        [SwaggerOperation("Get the most recent Log entry for given criteria.")]
        [SwaggerResponse(200, "The requested most recent Log entry.", typeof(ParticipantEvent))]
        [SwaggerResponse(404, 
            "No Survey Instance was found with the provided ID, " +
            "or no Events were found matching the criteria")]
        public IActionResult Last(
            [SwaggerParameter("ID of the Survey Instance.")]
            int instanceId,
            [SwaggerParameter("Identifier for a Survey Instance Participant.")]
            string participantId,
            [SwaggerParameter("The Source of the Event.")]
            string source,
            [SwaggerParameter("The Type of the Event.")]
            string type)
        {
            try
            {
                var e = _participantEvents.Last(instanceId, participantId, source, type);
                return e is null ? (ActionResult) NotFound() : Ok(e);
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpGet("{type}")]
        [SwaggerOperation("Get the most recent Log entry for given criteria.")]
        [SwaggerResponse(200, "The requested most recent Log entry.", typeof(ParticipantEvent))]
        [SwaggerResponse(404,
            "No Survey Instance was found with the provided ID, " +
            "or no Events were found matching the criteria")]
        public IActionResult Last(
            [SwaggerParameter("ID of the Survey Instance.")]
            int instanceId,
            [SwaggerParameter("Identifier for a Survey Instance Participant.")]
            string participantId,
            [SwaggerParameter("The Type of the Event.")]
            string type)
        {
            try
            {
                var e = _participantEvents.Last(instanceId, participantId, type);
                return e is null ? (ActionResult)NotFound() : Ok(e);
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPost("{source}/{type}")]
        [SwaggerOperation("Log a Participant event.")]
        [SwaggerResponse(204, "The event was logged successfully.")]
        [SwaggerResponse(404, "No Survey Instance was found with the provided ID.")]
        public IActionResult Log(
            [SwaggerParameter("ID of the Survey Instance.")]
            int instanceId,
            [SwaggerParameter("Identifier for a Survey Instance Participant.")]
            string participantId,
            [SwaggerParameter("The Source of the Event.")]
            string source,
            [SwaggerParameter("The Type of the Event.")]
            string type,
            [FromBody]
            [SwaggerParameter("The Event payload.")]
            JObject payload)
        {
            try
            {
                _participantEvents.Log(instanceId, participantId, new ParticipantEvent
                {
                    Source = source,
                    Type = type,
                    Payload = payload
                });
                return NoContent();
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
        }
    }
}
