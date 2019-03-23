using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Decsys.Models;
using Decsys.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Newtonsoft.Json.Linq;
using Swashbuckle.AspNetCore.Annotations;

namespace Decsys.Controllers
{
    [ApiController]
    [Route("api/surveys/{id}/pages/{pageId}/components")]
    public class ComponentsController : ControllerBase
    {
        private readonly ComponentService _components;
        private readonly IConfiguration _config;
        private readonly IFileProvider _fileProvider;

        public ComponentsController(
            IHostingEnvironment env,
            IConfiguration config,
            ComponentService components)
        {
            _components = components;
            _config = config;
            _fileProvider = env.ContentRootFileProvider;
        }

        [HttpGet]
        [Route("/api/components")]
        [SwaggerOperation("Get a JavaScript component module loader.",
            description: "Returns a dyamically generated JavaScript file " +
            "which imports all custom component modules " +
            "and adds them by name to a global dictionary of available components.")]
        public FileResult GetComponentModules()
        {
            // TODO: Move the hard work to a service?

            var output = new StringBuilder();
            const string global = "window.__DECSYS__";
            const string components = ".Components";
            output.Append(global).Append(" = ").Append(global).AppendLine(" || {};");
            output.Append(global).Append(components).AppendLine(" = {};");

            // Enumerate the files
            var componentFiles = _fileProvider.GetDirectoryContents(
                _config["Paths:Components:Root"]);

            var counter = 0;

            foreach (var file in componentFiles)
            {
                // for now we only want root .js files
                if (file.IsDirectory || Path.GetExtension(file.PhysicalPath) != ".js") continue;

                // TODO: maybe check some of the code? hmm... would need a js linter/parser/something for that
                // maybe we can run some js unit tests for this?
                // might be able to use node tools for this, but we'll need node on the server
                // which is a bit rubbish for running outside docker...
                // particularly in a "local" install

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

            output.Append("document.dispatchEvent(new Event('__DECSYS__ComponentsLoaded'));");

            return File(Encoding.UTF8.GetBytes(output.ToString()), "application/javascript");
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
        public IActionResult Delete(
            [SwaggerParameter("ID of the Survey to delete a Page from.")]
            int id,
            [SwaggerParameter("ID of the Page to add a Component to.")]
            Guid pageId,
            [SwaggerParameter("ID of the Component to delete.")]
            Guid componentId)
            => _components.Delete(id, pageId, componentId)
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

        [HttpPut("{componentId}/duplicate")]
        [SwaggerOperation("Duplicates a Component in a Page.")]
        [SwaggerResponse(200,
            "The Component was duplicated successfully and the new Component is returned.",
            Type = typeof(Component))]
        [SwaggerResponse(404, "No Component, Page, or Survey, was found with the provided ID.")]
        public IActionResult Duplicate(
            [SwaggerParameter("ID of the Survey to duplicate the Component in.")]
            int id,
            [SwaggerParameter("ID of the Page to duplicate the Component in.")]
            Guid pageId,
            [SwaggerParameter("ID of the Component to duplicate.")]
            Guid componentId)
        {
            try
            {
                return Ok(_components.Duplicate(id, pageId, componentId));
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
        }
    }
}
