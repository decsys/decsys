using System.Text;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Swashbuckle.AspNetCore.Annotations;

namespace Decsys.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComponentsController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IFileProvider _fileProvider;

        public ComponentsController(IHostingEnvironment env, IConfiguration config)
        {
            _config = config;
            _fileProvider = env.ContentRootFileProvider;
        }

        [HttpGet]
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
                if (file.IsDirectory) continue; // for now we only want root files

                // TODO: maybe check some of the code? hmm... would need a js linter/parser/something for that
                // maybe we can run some js unit tests for this?
                // might be able to use node tools for this, but we'll need node on the server
                // which is a bit rubbish for running outside docker...
                // particularly in a "local" install

                // Import the component module, and some metadata
                output.Append(
                    "import Module").Append(++counter)
                    .Append(", { name as name").Append(counter)
                    //.Append(" , version as version").Append(counter) // TODO: work out new versioning
                    .Append(" } from '/static/components/").Append(file.Name)
                    .AppendLine("';");

                // Add the module to our components dictionary
                output.Append(global).Append(components)
                    .Append("[name").Append(counter)
                    .Append("] = Module").Append(counter)
                    .AppendLine(";");
            }

            output.Append("document.dispatchEvent(new Event('__DECSYS__ComponentsLoaded'));");

            return File(Encoding.UTF8.GetBytes(output.ToString()), "application/javascript");
        }
    }
}
