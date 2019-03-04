using System.Collections.Generic;
using Decsys.Data.Entities;
using Decsys.Models;
using Decsys.Services;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Decsys.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SurveysController : Controller
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
            => Ok(_surveys.Get(id)) ?? (ActionResult)NotFound();

        [HttpPost]
        public IActionResult Create(string name = null)
        {
            var id = _surveys.Create(name);
            return Created(Url.Action("Get", new { id }), id);
        }

        [HttpPut("{id}/name")]
        public IActionResult EditName(int id, [FromBody] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest($"{nameof(name)} must not be empty.");

            try
            {
                _surveys.EditName(id, name); return Ok(name);
            }
            catch (KeyNotFoundException) { return NotFound(); }
        }
    }
}
