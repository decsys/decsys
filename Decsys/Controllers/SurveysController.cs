using System.Collections.Generic;
using Decsys.Data.Entities;
using Decsys.Models;
using Decsys.Services;
using Microsoft.AspNetCore.Mvc;

namespace Decsys.Controllers
{
    [Route("api/[controller]")]
    public class SurveysController : Controller
    {
        private readonly SurveyService _surveys;

        public SurveysController(SurveyService surveys)
        {
            _surveys = surveys;
        }

        private static readonly SurveySummary[] Summaries = new[]
        {
             new SurveySummary { Id = 1, Name = "Jon Survey", RunCount = 15, Active = false },
             new SurveySummary { Id = 3, Name = "Abc Survey", RunCount = 10, Active = true },
             new SurveySummary { Id = 2, Name = "Lol Survey with a really long name i guess?", RunCount = 0, Active = false }
        };

        [HttpGet]
        public IEnumerable<SurveySummary> List() => Summaries;

        [HttpGet("{id}")]
        public IActionResult Get(int id)
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
