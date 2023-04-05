using Decsys.Auth;
using Decsys.Models;
using Decsys.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Decsys.Controllers
{
    [ApiController]
    [Route("api/surveys/{id}/[controller]")]
    [Authorize(Policy = nameof(AuthPolicies.CanManageSurvey))]
    public class InstancesController : ControllerBase
    {
        private readonly SurveyInstanceService _instances;
        private readonly ParticipantEventService _participantEvents;
        private readonly IAuthorizationService _auth;

        public InstancesController(
            SurveyInstanceService instances,
            ParticipantEventService participantEvents,
            IAuthorizationService auth)
        {
            _instances = instances;
            _participantEvents = participantEvents;
            _auth = auth;
        }

        [HttpGet("{instanceId}/results")]
        [SwaggerOperation("Get results for a Survey Instance.")]
        [SwaggerResponse(200, "The requested full results of an Survey Instance.", 
            typeof(SurveyInstanceResults<ParticipantEvents>))]        
        [SwaggerResponse(200, "The requested summary results of an Survey Instance.", 
            typeof(SurveyInstanceResults<ParticipantResultsSummary>))]
        [SwaggerResponse(404,
            "No Survey Instance was found with the provided ID.")]
        public IActionResult Results(
            [SwaggerParameter("ID of the Survey Instance.")]
            int instanceId,
            [SwaggerParameter("Return results type")]
            string? type = "summary")
            => type switch
            {
                "summary" => ResultsSummary(instanceId),
                "full" => ResultsFull(instanceId),
                _ => BadRequest(
                    $"The specified results type '{type}' requested was invalid. " +
                    "Please specify one of: summary, full"),
            };

        private IActionResult ResultsFull(int instanceId)
        {
            try
            {
                var results = _participantEvents.Results(instanceId);
                return Ok(results);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        private IActionResult ResultsSummary(int instanceId)
        {
            try
            {
                var results = _participantEvents.ResultsSummary(instanceId);
                return Ok(results);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpGet]
        [SwaggerOperation("List all Survey Instances for a Survey.")]
        [SwaggerResponse(200, "A list of Survey Instances.", Type = typeof(IEnumerable<SurveyInstance>))]
        [SwaggerResponse(404, "No Survey was found with the provided ID.")]
        public IActionResult List(int id)
        {
            try
            {
                return Ok(_instances.List(id));
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpGet("{instanceId}")]
        [SwaggerOperation("Get a single Survey Instance by ID.")]
        [SwaggerResponse(200, "The Survey Instance.", Type = typeof(SurveyInstance))]
        [SwaggerResponse(404, "No Survey Instance, or Survey, was found with the provided ID.")]
        [AllowAnonymous]
        public async Task<ActionResult<SurveyInstance>> Get(int id, int instanceId)
        {
            try
            {
                var instance = _instances.Get(id, instanceId);
                var canManageSurvey =
                    await _auth.AuthorizeAsync(User, HttpContext, nameof(AuthPolicies.CanManageSurvey));

                if (!canManageSurvey.Succeeded)
                {
                    // hide private stuff if user not authorized
                    instance.ValidIdentifiers = new();
                    instance.Survey.ValidIdentifiers = new();
                }

                return instance;
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost]
        [SwaggerOperation("Create a Survey Instance for a Survey, or resume the current instance if appropriate.")]
        [SwaggerResponse(201, "The Survey Instance was created with the returned ID.")]
        [SwaggerResponse(404, "No Survey was found with the provided ID.")]
        [SwaggerResponse(400, "This Survey already has an active Instance.")]
        public IActionResult Activate(int id)
        {
            try
            {
                var instanceId = _instances.Activate(id);
                var url = Url.Action("Get", "Instances", new { id, instanceId })
                          ?? throw new InvalidOperationException("Failed to get URL for an Action Route.");

                return Created(url, instanceId);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (ArgumentException e)
            {
                return BadRequest(e);
            }
        }

        [HttpPost("{instanceId}/close")]
        [SwaggerOperation("Close a Survey Instance for a Survey. (Temporarily if appropriate.)")]
        [SwaggerResponse(204, "The Survey Instance was closed successfully.")]
        [SwaggerResponse(404, "No Survey Instance, or Survey, was found with the provided ID.")]
        public IActionResult Deactivate(int id, int instanceId)
        {
            try
            {
                _instances.Close(id, instanceId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
