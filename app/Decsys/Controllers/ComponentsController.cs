using System.Text;

using Decsys.Auth;
using Decsys.Models;
using Decsys.Services;
using Decsys.Services.Contracts;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;

using Newtonsoft.Json.Linq;

using Swashbuckle.AspNetCore.Annotations;

namespace Decsys.Controllers
{
    [ApiController]
    [Route("api/surveys/{id}/pages/{pageId}/components")]
    [Authorize(Policy = nameof(AuthPolicies.CanManageSurvey))]
    public class ComponentsController : ControllerBase
    {
        private readonly ComponentService _components;
        private readonly ComponentFileService _componentFiles;
        private readonly IImageService _images;
        private readonly IConfiguration _config;
        private readonly IFileProvider _fileProvider;

        public ComponentsController(
            IWebHostEnvironment env,
            IConfiguration config,
            ComponentService components,
            ComponentFileService componentFiles,
            IImageService images)
        {
            _components = components;
            _componentFiles = componentFiles;
            _images = images;
            _config = config;
            _fileProvider = env.ContentRootFileProvider;
        }

        [HttpGet]
        [Route("/api/components")]
        [SwaggerOperation("Get a JavaScript component module loader.",
            description: "Returns a dyamically generated JavaScript file " +
            "which imports all custom component modules " +
            "and adds them by name to a global dictionary of available components.")]
        [AllowAnonymous]
        public FileResult GetComponentModules()
        {
            var output = new StringBuilder();
            const string global = "window.__DECSYS__";
            const string components = ".Components";
            output.Append(global).Append(" = ").Append(global).AppendLine(" || {};");
            output.Append(global).Append(components).AppendLine(" = {};");

            // Enumerate the files
            var componentFiles = _fileProvider.GetDirectoryContents(
                _config["Paths:Components:Root"]);

            var counter = 0;

            foreach (var (_, file) in _componentFiles.ListFiles())
            {
                // Import the component module, and some metadata
                output.Append(
                    "import Decsys").Append(++counter)
                    .Append(", { name as name").Append(counter)
                    .Append(" } from '/static/components/").Append(file.Name)
                    .AppendLine("';");

                // Add the module to our components dictionary
                output.Append(global).Append(components)
                    .Append("[name").Append(counter)
                    .Append("] = Decsys").Append(counter)
                    .AppendLine(";");
            }

            output.AppendLine("document.dispatchEvent(new Event('__DECSYS__ComponentsLoaded'));");

            return File(Encoding.UTF8.GetBytes(output.ToString()), "application/javascript");
        }

        [HttpPut("{componentId}/isQuestionItem")]
        [SwaggerOperation("Set a Component as the Question Item for a Survey Page.")]
        [SwaggerResponse(204, "The Question Item was set successfully.")]
        [SwaggerResponse(404, "No Page, Survey, or Component, was found with the provided ID.")]
        public IActionResult SetQuestionItem(
            [SwaggerParameter("ID of the Survey the Page belongs to.")]
            int id,
            [SwaggerParameter("ID of the Page to set the Question Item for.")]
            Guid pageId,
            [SwaggerParameter("ID of the Component to set as the Question Item.")]
            Guid componentId)
        {
            try
            {
                _components.SetQuestionItem(id, pageId, componentId);
                return NoContent();
            } catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPut("{componentId}/isOptional")]
        [SwaggerOperation("Set a response to have a property of being optional")]
        [SwaggerResponse(204, "The Optional propoerty was set successfully.")]
        [SwaggerResponse(404, "No Page, Survey, or Component, was found with the provided ID.")]
        public IActionResult SetIsOptional(
            [SwaggerParameter("ID of the Survey the Page belongs to.")]
            int id,
            [SwaggerParameter("ID of the Page to set the Question Item for.")]
            Guid pageId,
            [SwaggerParameter("ID of the Component to set as the Question Item.")]
            Guid componentId,
            [SwaggerParameter("Boolean value to set the IsOptional property to.")]
            [FromBody] bool isOptional)

        {
            try
            {
                _components.SetOptional(id, pageId, componentId, isOptional);
                return NoContent();
            } catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost]
        [SwaggerOperation("Add a new Component to a Survey Page.")]
        [SwaggerResponse(200, "The Component was added successfully.", typeof(Component))]
        [SwaggerResponse(404, "No Page, or Survey, was found with the provided ID.")]
        public IActionResult Create(
            [SwaggerParameter("ID of the Survey the Page belongs to.")]
            int id,
            [SwaggerParameter("ID of the Page to add a Component to.")]
            Guid pageId,
            [SwaggerParameter("The type of component to add.")]
            [FromBody] string type)
        {
            try
            {
                return Ok(_components.Create(id, pageId, type));
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{componentId}")]
        [SwaggerOperation("Delete a Component from a Survey Page.")]
        [SwaggerResponse(204, "The Component was deleted successfully.")]
        [SwaggerResponse(404, "No Component, Page, or Survey, was found with the provided ID.")]
        public async Task<IActionResult> Delete(
            [SwaggerParameter("ID of the Survey to delete a Page from.")]
            int id,
            [SwaggerParameter("ID of the Page to add a Component to.")]
            Guid pageId,
            [SwaggerParameter("ID of the Component to delete.")]
            Guid componentId)
            => await _components.Delete(id, pageId, componentId)
                ? (ActionResult)NoContent()
                : NotFound();


        [HttpPut("{componentId}/order")]
        [SwaggerOperation("Set the Order of a Component on a Survey Page.")]
        [SwaggerResponse(204, "The Component was moved successfully.")]
        [SwaggerResponse(404, "No Component, Page, or Survey, was found with the provided ID.")]
        public IActionResult Move(
            [SwaggerParameter("ID of the Survey the Page belongs to.")]
            int id,
            [SwaggerParameter("ID of the Page the Component belongs to.")]
            Guid pageId,
            [SwaggerParameter("ID of the Component to change the order of.")]
            Guid componentId,
            [FromBody]
            [SwaggerParameter("The new order value for the Component.")]
            int targetPosition)
        {
            try
            {
                _components.Move(id, pageId, componentId, targetPosition);
                return NoContent();
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPatch("{componentId}/params")]
        [SwaggerOperation("Edit parameter values for the Component.")]
        [SwaggerResponse(204, "The Component params were updated successfully.")]
        [SwaggerResponse(404, "No Component, Page, or Survey, was found with the provided ID.")]
        public IActionResult EditParams(
            [SwaggerParameter("ID of the Survey the Page belongs to.")]
            int id,
            [SwaggerParameter("ID of the Page the Component belongs to.")]
            Guid pageId,
            [SwaggerParameter("ID of the Component to update the parameters of.")]
            Guid componentId,
            [FromBody]
            [SwaggerParameter(
                "A dictionary of parameter keys and values " +
                "to merge into the Component's currently stored parameters.")]
            JObject componentParams)
        {
            try
            {
                _components.MergeParams(id, pageId, componentId, componentParams);
                return NoContent();
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpDelete("{componentId}/params/{paramKey}")]
        [SwaggerOperation("Clear the value of a Component parameter.")]
        [SwaggerResponse(204, "The Component parameter was cleared successfully.")]
        [SwaggerResponse(404, "No Component, Page, or Survey, was found with the provided ID.")]
        public IActionResult ClearParam(
            [SwaggerParameter("ID of the Survey the Page belongs to.")]
            int id,
            [SwaggerParameter("ID of the Page the Component belongs to.")]
            Guid pageId,
            [SwaggerParameter("ID of the Component to clear the parameter of.")]
            Guid componentId,
            [SwaggerParameter("The Key value of the parameter to clear")]
            string paramKey)
        {
            try
            {
                _components.ClearParam(id, pageId, componentId, paramKey);
                return NoContent();
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPost("{componentId}/duplicate")]
        [SwaggerOperation("Duplicates a Component in a Page.")]
        [SwaggerResponse(200,
            "The Component was duplicated successfully and the new Component is returned.",
            Type = typeof(Component))]
        [SwaggerResponse(404, "No Component, Page, or Survey, was found with the provided ID.")]
        public async Task<IActionResult> Duplicate(
            [SwaggerParameter("ID of the Survey to duplicate the Component in.")]
            int id,
            [SwaggerParameter("ID of the Page to duplicate the Component in.")]
            Guid pageId,
            [SwaggerParameter("ID of the Component to duplicate.")]
            Guid componentId)
        {
            try
            {
                return Ok(await _components.Duplicate(id, pageId, componentId));
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPut("{componentId}/image")]
        [SwaggerOperation("Stores an image for a given Image component.")]
        [SwaggerResponse(204, "The Image was stored successfully.")]
        [SwaggerResponse(404, "No Component, Page, or Survey, was found with the provided ID.")]
        public async Task<IActionResult> UploadImage(
            [SwaggerParameter("ID of the Survey the Component belongs to.")]
            int id,
            [SwaggerParameter("ID of the Page the Component belongs to.")]
            Guid pageId,
            [SwaggerParameter("ID of the Component to upload the image for.")]
            Guid componentId,
            [SwaggerParameter("The actual image file")]
            IFormFile file)
        {
            (string extension, byte[] bytes) fileData; // convert IFormFile to its extension and data
            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                fileData = (Path.GetExtension(file.FileName), stream.ToArray());
            }

            await _images.StoreImage(id, componentId, fileData);

            try
            {
                _components.MergeParams(id, pageId, componentId,
                    JObject.Parse($@"{{""extension"": ""{fileData.extension}""}}"));
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }

            return NoContent();
        }

        [HttpDelete("{componentId}/image")]
        [SwaggerOperation("Removes the image for a given Image component.")]
        [SwaggerResponse(204, "The Image was removed successfully.")]
        [SwaggerResponse(404, "No Component, Page, or Survey, was found with the provided ID.")]
        public async Task<IActionResult> RemoveImage(
            [SwaggerParameter("ID of the Survey the Component belongs to.")]
            int id,
            [SwaggerParameter("ID of the Page the Component belongs to.")]
            Guid pageId,
            [SwaggerParameter("ID of the Component to remove the image from.")]
            Guid componentId)
        {
            try
            {
                // remove the actual image file
                await _images.RemoveImage(id, pageId, componentId);

                // update the component params
                _components.ClearParam(id, pageId, componentId, "extension");
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }

            return new EmptyResult();
        }
    }
}
