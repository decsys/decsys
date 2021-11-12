using Decsys.Services.Contracts;

namespace Decsys.Services
{
    public class LocalPathsProvider : ILocalPathsProvider
    {
        private readonly Dictionary<string, string> _localPaths;

        public LocalPathsProvider(IConfiguration c, IWebHostEnvironment env)
        {
            var localDataPath = c["Paths:LocalData"];

            // make relative to contentRootPath if not absolute
            localDataPath = Path.IsPathRooted(localDataPath)
                ? localDataPath
                : Path.Combine(env.ContentRootPath, localDataPath);

            // map our defined paths to absolute paths dictionary
            _localPaths = new List<(string key, string path)>
            {
                ("SurveyImages", "survey-images"),
                ("Databases", "db")
            }
            .ToDictionary(
                subDir => subDir.key,
                subDir => Path.Combine(localDataPath, subDir.path));

            // ensure they all exist
            _localPaths.Values.ToList().ForEach(p => Directory.CreateDirectory(p));
        }

        public string Databases => _localPaths["Databases"];

        public string SurveyImages => _localPaths["SurveyImages"];
    }
}
