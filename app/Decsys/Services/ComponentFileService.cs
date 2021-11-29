using Microsoft.Extensions.FileProviders;

namespace Decsys.Services
{
    /// <summary>
    /// Survey Page functionality
    /// </summary>
    public class ComponentFileService
    {
        private readonly IConfiguration _config;
        private readonly IFileProvider _fileProvider;


        public ComponentFileService(IConfiguration config, IWebHostEnvironment env)
        {
            _config = config;
            _fileProvider = env.ContentRootFileProvider;
        }

        /// <summary>
        /// List Component Files from disk, with their names
        /// </summary>
        /// <returns></returns>
        public List<(string name, IFileInfo file)> ListFiles()
        => _fileProvider.GetDirectoryContents(
                _config["Paths:Components:Root"]).Aggregate(new List<(string, IFileInfo)>(), (result, file) =>
                {
                    // for now we only want root .js files
                    if (file.IsDirectory || Path.GetExtension(file.PhysicalPath) != ".js")
                        return result;

                    // TODO: maybe check some of the code? hmm... would need a js linter/parser/something for that
                    // maybe we can run some js unit tests for this?
                    // might be able to use node tools for this, but we'll need node on the server
                    // which is a bit rubbish for running outside docker...
                    // particularly in a "local" install

                    result.Add((Path.GetFileNameWithoutExtension(file.PhysicalPath), file));
                    return result;
                });

        /// <summary>
        /// Check if a given component type matches one of the loaded responses
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public bool IsResponseItem(string type) => ListFiles().Any(x => x.name == type);
    }
}
