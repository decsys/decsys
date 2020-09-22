using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Decsys.Auth;
using Decsys.Config;
using Decsys.Models;
using Decsys.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Swashbuckle.AspNetCore.Annotations;

namespace Decsys.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = nameof(AuthPolicies.IsSurveyAdmin))]
    public class SurveysController : ControllerBase
    {
        private readonly AppMode _mode;
        private readonly SurveyService _surveys;
        private readonly SurveyInstanceService _instances;
        private readonly ExportService _export;

        private readonly string _internalSurveysPath;

        public SurveysController(
            IOptions<AppMode> mode,
            SurveyService surveys,
            ExportService export,
            SurveyInstanceService instances,
            IWebHostEnvironment env)
        {
            _mode = mode.Value;
            _surveys = surveys;
            _export = export;
            _instances = instances;
            _internalSurveysPath = Path.Combine(env.ContentRootPath, "surveys");
        }

        [HttpGet]
        [SwaggerOperation("List summary data for all Surveys the authenticated User can access.")]
        public IEnumerable<SurveySummary> List()
            => _surveys.List(
                _mode.IsWorkshop ? null : User.GetUserId(),
                User.IsSuperUser());

        [HttpGet("{id}")]
        [Authorize(Policy = nameof(AuthPolicies.CanManageSurvey))]
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
            var id = _surveys.Create(
                name: null,
                ownerId: _mode.IsWorkshop
                    ? null
                    : User.GetUserId());
            return Created(Url.Action("Get", new { id }), id);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = nameof(AuthPolicies.CanManageSurvey))]
        [SwaggerOperation("Delete a single Survey by ID.")]
        [SwaggerResponse(204, "The Survey, with its associated data, was succesfully deleted.")]
        public async Task<IActionResult> Delete(
            [SwaggerParameter("ID of the Survey to delete.")]
            int id)
        {
            await _surveys.Delete(id);
            return NoContent();
        }

        [HttpPut("{id}/name")]
        [Authorize(Policy = nameof(AuthPolicies.CanManageSurvey))]
        [SwaggerOperation("Edit the Name of a single Survey by ID.")]
        [SwaggerResponse(200, "The Survey Name was updated successfully.")]
        [SwaggerResponse(400, "No valid name was provided.")]
        [SwaggerResponse(404, "No Survey was found with the provided ID.")]
        public ActionResult<string> EditName(int id, [FromBody] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest($"{nameof(name)} must not be empty.");

            try
            {
                _surveys.EditName(id, name);
                return name;
            }
            catch (KeyNotFoundException) { return NotFound(); }
        }

        [HttpPost("{id}/duplicate")]
        [Authorize(Policy = nameof(AuthPolicies.CanManageSurvey))]
        [SwaggerOperation("Duplicate a single Survey with the provided ID.")]
        [SwaggerResponse(200, "The Survey was duplicated successfully and the new copy has the returned ID.")]
        [SwaggerResponse(404, "No Survey was found with the provided ID.")]
        public async Task<ActionResult<int>> Duplicate(int id)
        {
            try
            {
                return await _surveys.Duplicate(id);
            }
            catch (KeyNotFoundException) { return NotFound(); }
        }

        [HttpPut("{id}/config")]
        [Authorize(Policy = nameof(AuthPolicies.CanManageSurvey))]
        [SwaggerOperation("Configure the Survey with the provided ID.")]
        [SwaggerResponse(204, "The Survey was configured successfully.")]
        [SwaggerResponse(404, "No Survey was found with the provided ID.")]
        public IActionResult Configure(int id, ConfigureSurveyModel config)
        {
            try
            {
                _surveys.Configure(id, config);
                return NoContent();
            }
            catch (KeyNotFoundException) { return NotFound(); }
        }

        [HttpGet("{id}/config")]
        [Authorize(Policy = nameof(AuthPolicies.CanManageSurvey))]
        [SwaggerOperation("Get the current Config for the Survey with the provided ID.")]
        [SwaggerResponse(200, "The Survey configuration as requested.", typeof(ConfigureSurveyModel))]
        [SwaggerResponse(404, "No Survey was found with the provided ID.")]
        public ActionResult<ConfigureSurveyModel> GetConfig(int id)
        {
            var survey = _surveys.Get(id);
            if (survey is null) return NotFound();
            return new ConfigureSurveyModel
            {
                UseParticipantIdentifiers = survey.UseParticipantIdentifiers,
                ValidIdentifiers = survey.ValidIdentifiers,
                OneTimeParticipants = survey.OneTimeParticipants
            };
        }

        [HttpGet("{id}/export")]
        [Authorize(Policy = nameof(AuthPolicies.CanManageSurvey))]
        public async Task<ActionResult<byte[]>> Export(int id, string? type = "structure")
            => type switch
            {
                "structure" => await _export.Structure(id),
                "full" => await _export.Full(id),
                _ => BadRequest($"Unexpected type '{type}'. " +
                    "Expected one of: full, structure"),
            };

        [HttpPost("internal/{type}")]
        public async Task<ActionResult<int>> LoadInternal(string type)
        {
            if (!new string[] { "demo", "sample" }.Contains(type))
                return BadRequest("Unrecognised type requested. Expected 'demo' or 'sample'.");

            using var fs = new FileStream(Path.Combine(_internalSurveysPath, $"{type}.zip"), FileMode.Open);
            var zip = new ZipArchive(fs);

            var (survey, images, instances) = ProcessImportZip(zip);
            if (survey is null)
                return BadRequest("The uploaded file doesn't contain a valid Survey Structure file.");

            return await HandleImport(survey, images, instances);
        }

        private static (
                Survey? survey,
                List<(string filename, byte[] data)> images,
                List<SurveyInstanceResults<ParticipantEvents>> instances
            )
            ProcessImportZip(
                ZipArchive zip,
                bool importData = false)
        {
            Survey? survey = null;
            var images = new List<(string filename, byte[] data)>();
            var instances = new List<SurveyInstanceResults<ParticipantEvents>>();

            foreach (var entry in zip.Entries)
            {
                if (entry.Length <= 0) continue;

                if (entry.FullName.StartsWith("images/"))
                {
                    byte[] bytes;
                    using (var ms = new MemoryStream())
                    {
                        entry.Open().CopyTo(ms);
                        bytes = ms.ToArray();
                    }
                    images.Add((entry.FullName.Replace("images/", string.Empty), bytes));
                }

                if (entry.FullName == "structure.json")
                {
                    using var reader = new StreamReader(entry.Open(), Encoding.UTF8);
                    survey = JsonConvert.DeserializeObject<Survey>(reader.ReadToEnd());
                }
                else if (importData && entry.FullName.StartsWith("Instance-") && entry.FullName.EndsWith(".json"))
                {
                    try
                    {
                        using var reader = new StreamReader(entry.Open(), Encoding.UTF8);
                        instances.Add(JsonConvert.DeserializeObject<SurveyInstanceResults<ParticipantEvents>>(reader.ReadToEnd()));
                    }
                    catch (JsonSerializationException)
                    {
                        // This is fine 🔥🍵🐕🔥
                        // We just don't import what we can't deserialize as an instance
                        // TODO: Maybe someday we could report on the result of our attempted import ¯\_(ツ)_/¯
                    }
                }
            }

            return (survey, images, instances);
        }

        private async Task<int> HandleImport(
            Survey survey,
            List<(string filename, byte[] data)> images,
            List<SurveyInstanceResults<ParticipantEvents>> instances)
        {
            var surveyId = await _surveys.Import(
                survey,
                images,
                _mode.IsWorkshop
                    ? null
                    : User.GetUserId());

            // attempt to import any instances
            if (instances.Count > 0)
                _instances.Import(instances, surveyId);

            return surveyId;
        }

        [HttpPost("import")]
        public async Task<ActionResult<int>> Import(
            bool importData,
            [SwaggerParameter("The survey export file")]
            IFormFile file)
        {
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream).ConfigureAwait(false);
            var zip = new ZipArchive(stream);

            var (survey, images, instances) = ProcessImportZip(zip, importData);
            if (survey is null)
                return BadRequest("The uploaded file doesn't contain a valid Survey Structure file.");

            return await HandleImport(survey, images, instances);
        }
    }
}
