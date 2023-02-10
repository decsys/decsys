using Decsys.Config;
using Decsys.Services.Contracts;

using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.FileProviders;

using UoN.AspNetCore.VersionMiddleware;
using UoN.VersionInformation;

namespace Decsys
{
    public static class WebApplicationExtensions
    {
        public static void UseAppVersion(this WebApplication app)
        {
            var version = app.Services.GetRequiredService<VersionInformationService>();

            // start with the keys from the file, cast back to the original dictionary
            var versionInfo = (Dictionary<string, string>)
                (version.ByKey("file", "version.txt")
                    ?? new Dictionary<string, string>());

            // Add further keys, so everything's at the top level
            versionInfo["API App"] = (string)version.EntryAssembly();

            app.UseVersion(versionInfo);
        }

        public static void UseAppStaticFiles(this WebApplication app, AppMode mode)
        {
            // in future we may want to make this a configurable list.
            var validComponentExtensions = new List<string> { ".js", ".map" };

            // steal the mappings we want from a default FileExtensionContentTypeProvider
            var validComponentMappings = new FileExtensionContentTypeProvider().Mappings
                .Where(x => validComponentExtensions.Contains(x.Key))
                .ToDictionary(x => x.Key, x => x.Value,
                    StringComparer.OrdinalIgnoreCase);



            // plain old `wwwroot`
            app.UseStaticFiles();

            // components' static files
            // serve static files but only those we can validly map
            app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(
                        Path.Combine(app.Environment.ContentRootPath, app.Configuration["Paths:Components:Root"])),
                    RequestPath = "/static/components",
                    ContentTypeProvider = new FileExtensionContentTypeProvider(validComponentMappings)
                });

            // Survey Images
            if (mode.IsWorkshop)
            {
                var paths = app.Services.GetRequiredService<ILocalPathsProvider>();

                // simply serve static files from disk
                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(paths.SurveyImages),
                    RequestPath = "/surveys/images"
                });
            }
        }
    }
}
