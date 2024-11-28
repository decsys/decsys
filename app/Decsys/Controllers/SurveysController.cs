using Decsys.Auth;
using Decsys.Config;
using Decsys.Models;
using Decsys.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using Swashbuckle.AspNetCore.Annotations;

using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        private readonly StudyAllocationService _studies;
        private readonly ExportService _export;

        private readonly string _internalSurveysPath;

        public SurveysController(
            IOptions<AppMode> mode,
            SurveyService surveys,
            ExportService export,
            SurveyInstanceService instances,
            IWebHostEnvironment env,
            StudyAllocationService studies)
        {
            _mode = mode.Value;
            _surveys = surveys;
            _export = export;
            _instances = instances;
            _studies = studies;
            _internalSurveysPath = Path.Combine(env.ContentRootPath, "surveys");
        }

        private string? OwnerId => _mode.IsWorkshop ? null : User.GetUserId();

        [HttpGet]
        [SwaggerOperation("List summary data for all Surveys the authenticated User can access.")]
        public IEnumerable<SurveySummary> List()
            => _surveys.List(
                OwnerId,
                User.IsSuperUser());

        [HttpGet("{id}/children")]
        [SwaggerOperation("List summary data for all Child Surveys of this.")]
        public IEnumerable<SurveySummary> ListChildren(int id)
            => _surveys.ListChildren(id);

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
                ? NotFound()
                : Ok(survey);
        }

        [HttpPost("external/{surveyId?}")]
        [SwaggerOperation("Lookup Survey details for an External Survey, from the external params")]
        [SwaggerResponse(200, "The looked up Survey details")]
        [AllowAnonymous]
        public ActionResult<ExternalLookupDetails> LookupExternal([FromBody] JObject model, int? surveyId = null)
        {
            try
            {
                return _surveys.LookupExternal(model, surveyId);
            }
            catch (ArgumentException e)
            {
                return BadRequest(e);
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e);
            }
        }

        [HttpPost]
        [SwaggerOperation("Create a new Survey.")]
        [SwaggerResponse(201, "The Survey was successfully created with the returned ID.")]
        public IActionResult Create(CreateSurveyModel model)
        {
            var id = _surveys.Create(model, OwnerId);
            var url = Url.Action("Get", new { id }) ?? throw new InvalidOperationException("Failed to get a URL for an Action Route.");
            return Created(url, id);
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

        [HttpPut("{id}/parent/{parentId?}")]
        [Authorize(Policy = nameof(AuthPolicies.CanManageSurvey))]
        [SwaggerOperation("Edit the Name of a single Survey by ID.")]
        [SwaggerResponse(204, "The Survey's Parent was updated successfully.")]
        [SwaggerResponse(400, "The specified Survey cannot be a child, or the specified Parent cannot be a parent.")]
        [SwaggerResponse(404, "Either the Survey or Parent could not be found.")]
        public ActionResult SetParent(int id, int? parentId)
        {
            try
            {
                _surveys.SetParent(id, parentId);
                return NoContent();
            }
            catch (KeyNotFoundException) { return NotFound(); }
            catch (ArgumentException e) { return BadRequest(e.Message); }
        }

        [HttpPost("{id}/duplicate")]
        [Authorize(Policy = nameof(AuthPolicies.CanManageSurvey))]
        [SwaggerOperation("Duplicate a single Survey with the provided ID.")]
        [SwaggerResponse(200, "The Survey was duplicated successfully and the new copy has the returned ID.")]
        [SwaggerResponse(404, "No Survey was found with the provided ID.")]
        public async Task<ActionResult<int>> Duplicate(int id, CreateSurveyModel model)
        {
            try
            {
                return await _surveys.Duplicate(id, model, OwnerId);
            }
            catch (KeyNotFoundException) { return NotFound(); }
        }

        [HttpPut("{id}/settings")]
        [Authorize(Policy = nameof(AuthPolicies.CanManageSurvey))]
        [SwaggerOperation("Replace Type Settings for the Survey with the provided ID.")]
        [SwaggerResponse(204, "The Survey Type Settings were updated successfully.")]
        [SwaggerResponse(404, "No Survey was found with the provided ID.")]
        public IActionResult Configure(int id, JObject settings)
        {
            try
            {
                _surveys.EditSettings(id, settings);
                return NoContent();
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
        public async Task<ActionResult<int>> LoadInternal(string type, CreateSurveyModel model)
        {
            if (!new string[] { "demo", "sample" }.Contains(type))
                return BadRequest("Unrecognised type requested. Expected 'demo' or 'sample'.");

            using var fs = new FileStream(Path.Combine(_internalSurveysPath, $"{type}.zip"), FileMode.Open);
            var zip = new ZipArchive(fs);

            var import = ProcessImportZip(zip);
            if (import.
                Survey is null)
                return BadRequest("The uploaded file doesn't contain a valid Survey Structure file.");

            var (surveyId, _) = await HandleImport(import.Survey, import.Images, import.Instances, model);
            return surveyId;
        }

        private static ImportZipContentModel ProcessImportZip(ZipArchive zip, bool importData = false)
        {
            ImportZipContentModel result = new();

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
                    result.Images.Add((entry.FullName.Replace("images/", string.Empty), bytes));
                }

                if (entry.FullName == "structure.json")
                {
                    using var reader = new StreamReader(entry.Open(), Encoding.UTF8);
                    result.Survey = JsonConvert.DeserializeObject<Survey>(reader.ReadToEnd());

                    // always orphan surveys at this stage of import;
                    // if we are importing into a study,
                    // the correct parent will be assigned later in the process
                    if(result.Survey is not null)
                        result.Survey.Parent = null;
                }
                else if (importData && entry.FullName.StartsWith("Instance-") && entry.FullName.EndsWith(".json"))
                {
                    try
                    {
                        using var reader = new StreamReader(entry.Open(), Encoding.UTF8);
                        var results = JsonConvert.DeserializeObject<SurveyInstanceResults<ParticipantEvents>>(reader.ReadToEnd());
                        if(results is not null) result.Instances.Add(results);
                    }
                    catch (JsonSerializationException)
                    {
                        // This is fine 🔥🍵🐕🔥
                        // We just don't import what we can't deserialize as an instance
                        // TODO: Maybe someday we could report on the result of our attempted import ¯\_(ツ)_/¯
                    }
                }
                else if (importData && entry.FullName.StartsWith("StudyInstance-") && entry.FullName.EndsWith(".json"))
                {
                    try
                    {
                        using var reader = new StreamReader(entry.Open(), Encoding.UTF8);
                        var allocations = JsonConvert.DeserializeObject<StudyInstanceAllocationData>(reader.ReadToEnd());
                        if(allocations is not null) result.StudyInstances.Add(allocations);
                    }
                    catch (JsonSerializationException)
                    {
                        // This is fine 🔥🍵🐕🔥
                        // We just don't import what we can't deserialize as an instance
                        // TODO: Maybe someday we could report on the result of our attempted import ¯\_(ツ)_/¯
                    }
                }
                else if (entry.FullName.EndsWith(".zip"))
                {
                    // Nested zips are assumed to be child surveys
                    using var zipStream = entry.Open();
                    var childZip = new ZipArchive(zipStream);
                    result.Children.Add(ProcessImportZip(childZip, importData));
                }
            }

            return result;
        }

        private async Task<(int surveyId, Dictionary<int, int> instanceIdMap)> HandleImport(
            Survey survey,
            List<(string filename, byte[] data)> images,
            List<SurveyInstanceResults<ParticipantEvents>> instances,
            CreateSurveyModel model)
        {
            var surveyId = await _surveys.Import(
                survey,
                images,
                model,
                OwnerId);

            // attempt to import any instances
            Dictionary<int, int> instanceIdMap = new();
            if (instances.Count > 0)
                instanceIdMap = _instances.Import(instances, surveyId);

            return (surveyId, instanceIdMap);
        }

        [HttpPost("import")]
        public async Task<ActionResult<int>> Import(
            bool importData,
            ImportSurveyModel model)
        {
            if (model.File is null) return BadRequest("Missing uploaded file to import");

            using var stream = new MemoryStream();
            await model.File.CopyToAsync(stream).ConfigureAwait(false);
            var zip = new ZipArchive(stream);

            var import = ProcessImportZip(zip, importData);
            if (import.Survey is null)
                return BadRequest("The uploaded file doesn't contain a valid Survey Structure file.");


            var (importedId, _) = await HandleImport(import.Survey, import.Images, import.Instances, new()
            {
                Name = model.Name,
                Type = model.Type,
                Settings = model.Settings,
                ParentSurveyId = model.ParentSurveyId
            });

            if (import.Survey.IsStudy)
            {
                // We'll need to aggregate a map of instance ids across survey imports
                List<Dictionary<int, int>> instanceIdMaps = new();

                foreach (var child in import.Children)
                {
                    if (child.Survey is not null)
                    {
                        var (_, childIdMap) = await HandleImport(child.Survey, child.Images, child.Instances, new()
                        {
                            Name = child.Survey.Name,
                            Type = child.Survey.Type,
                            Settings = child.Survey.Settings,
                            ParentSurveyId = importedId
                        });

                        instanceIdMaps.Add(childIdMap);
                    }
                }

                // merge id maps from all children into one list
                var idMap = instanceIdMaps.SelectMany(childIdMap => childIdMap)
                    .ToDictionary(item => item.Key, item => item.Value);

                // Import StudyInstance, amending child instance Id's from the map
                foreach (var instance in import.StudyInstances)
                {
                    // update allocation instance id's
                    instance.Allocations = instance.Allocations.ConvertAll(x =>
                    {
                        x.InstanceId = idMap[x.InstanceId];
                        return x;
                    });

                    // update child instance id's
                    instance.ChildInstanceIds = instance.ChildInstanceIds.ConvertAll(
                        oldId => idMap[oldId]);

                    // now import the study instance
                    _studies.ImportAllocationData(importedId, instance);
                }
            }

            return importedId;

        }

        [HttpPost("{id}/archive")]
        [Authorize(Policy = nameof(AuthPolicies.CanManageSurvey))]
        [SwaggerOperation("Archive the specified Survey.")]
        [SwaggerResponse(204, "The Survey was successfully archived.")]
        [SwaggerResponse(401, "Unauthorized.")]
        [SwaggerResponse(404, "No Survey was found with the provided ID.")]
        [SwaggerResponse(409, "Survey is not in a suitable state to archive.")]
        public IActionResult ArchiveSurvey(int id)
        {
            try
            {
                _surveys.ArchiveSurvey(id, OwnerId);
                return NoContent();
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
            catch (UnauthorizedAccessException e)
            {
                return Unauthorized(e.Message);
            }
            catch (InvalidOperationException e)
            {
                return Conflict(e.Message);
            }
        }

        [HttpPost("{id}/unarchive")]
        [Authorize(Policy = nameof(AuthPolicies.CanManageSurvey))]
        [SwaggerOperation("Unarchive the specified Survey.")]
        [SwaggerResponse(204, "The Survey was successfully unarchived.")]
        [SwaggerResponse(401, "Unauthorized.")]
        [SwaggerResponse(404, "No Survey was found with the provided ID.")]
        [SwaggerResponse(409, "Survey is already unarchived.")]
        public IActionResult UnarchiveSurvey(int id)
        {
            try
            {
                _surveys.UnarchiveSurvey(id, OwnerId);
                return NoContent();
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
            catch (UnauthorizedAccessException e)
            {
                return Unauthorized(e.Message);
            }
            catch (InvalidOperationException e)
            {
                return Conflict(e.Message);
            }
        }

        [HttpGet("filtered")]
        [SwaggerOperation("List summary data for Surveys filtered by name and view (unarchived, archived, or all).")]
        [SwaggerResponse(200, "A list of filtered Surveys.", typeof(IEnumerable<SurveySummary>))]
        public IEnumerable<SurveySummary> FilteredList(
            [FromQuery] string? name = null,
            [FromQuery] string view = "",
            [FromQuery] string sortBy = "name",
            [FromQuery] string direction = "up")

        {
            return _surveys.List(
                userId: OwnerId,
                includeOwnerless: User.IsSuperUser(),
                name,
                view,
                sortBy,
                direction);
        }
    }

    class ImportZipContentModel
    {
        public Survey? Survey { get; set; }
        public List<(string filename, byte[] data)> Images { get; set; } = new();
        public List<SurveyInstanceResults<ParticipantEvents>> Instances { get; set; } = new();
        public List<StudyInstanceAllocationData> StudyInstances { get; set; } = new();
        public List<ImportZipContentModel> Children { get; set; } = new();
    }
}
