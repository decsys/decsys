using System.Collections.Generic;
using Decsys.Models;
using Decsys.Services;
using Microsoft.AspNetCore.Mvc;

namespace Decsys.Controllers
{
    [Route("api/[controller]")]
    public class SurveysController : Controller
    {
        private readonly SurveyWriteService _surveyWrite;

        public SurveysController(SurveyWriteService surveyWrite)
        {
            _surveyWrite = surveyWrite;
        }

        private static readonly SurveySummary[] Summaries = new[]
        {
             new SurveySummary { Id = 1, Name = "Jon Survey", RunCount = 15, Active = false },
             new SurveySummary { Id = 3, Name = "Abc Survey", RunCount = 10, Active = true },
             new SurveySummary { Id = 2, Name = "Lol Survey with a really long name i guess?", RunCount = 0, Active = false }
        };

        [HttpGet]
        public IEnumerable<SurveySummary> List() => Summaries;

        [HttpPost]
        public SurveySummary Create(string name = null) => _surveyWrite.Create(name);
    }
}
