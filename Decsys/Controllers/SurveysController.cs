using System.Collections.Generic;
using Decsys.Models;
using Decsys.Services;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Decsys.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SurveysController : ControllerBase
    {
        private readonly SurveyService _surveys;

        public SurveysController(SurveyService surveys)
        {
            _surveys = surveys;
        }

        [HttpGet]
        [SwaggerOperation("List summary data for all Surveys.")]
        public IEnumerable<SurveySummary> List() => _surveys.List();

        [HttpGet("{id}")]
        [SwaggerOperation("Get a single Survey by ID.")]
        [SwaggerResponse(200, "The Survey with the requested ID.", typeof(Survey))]
        [SwaggerResponse(404, "No Survey was found with the provided ID.")]
        public IActionResult Get(
            [SwaggerParameter("ID of the Survey to get.")] int id)
        {
            var survey = _surveys.Get(id);
            return survey is null
                ? (ActionResult)NotFound()
                : Ok(survey);
        }

        [HttpPost]
        [SwaggerOperation("Create a new Survey with a default name.")]
        [SwaggerResponse(201, "The Survey was successfully created with the returned ID.")]
        public IActionResult Create()
        {
            var id = _surveys.Create();
            return Created(Url.Action("Get", new { id }), id);
        }

        [HttpDelete("{id}")]
        [SwaggerOperation("Delete a single Survey by ID.")]
        [SwaggerResponse(204, "The Survey, with its associated data, was succesfully deleted.")]
        public IActionResult Delete(
            [SwaggerParameter("ID of the Survey to delete.")]
            int id)
        {
            _surveys.Delete(id);
            return NoContent();
        }

        [HttpPut("{id}/name")]
        [SwaggerOperation("Edit the Name of a single Survey by ID.")]
        [SwaggerResponse(200, "The Survey Name was updated successfully.")]
        [SwaggerResponse(400, "No valid name was provided.")]
        [SwaggerResponse(404, "No Survey was found with the provided ID.")]
        public IActionResult EditName(int id, [FromBody] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest($"{nameof(name)} must not be empty.");

            try
            {
                _surveys.EditName(id, name);
                return Ok(name);
            }
            catch (KeyNotFoundException) { return NotFound(); }
        }

        [HttpPost("{id}/duplicate")]
        [SwaggerOperation("Duplicate a single Survey with the provided ID.")]
        [SwaggerResponse(200, "The Survey was duplicated successfully and the new copy has the returned ID.")]
        [SwaggerResponse(404, "No Survey was found with the provided ID.")]
        public IActionResult Duplicate(int id)
        {
            try
            {
                return Ok(_surveys.Duplicate(id));
            }
            catch (KeyNotFoundException) { return NotFound(); }
        }
    }
}
