using Decsys.Config;

namespace Decsys.Startup.Web;

public static class WebEntrypoint
{
    public static async Task Run(string[] args)
    {
        var b = WebApplication.CreateBuilder(args);

        b.Configuration.AddJsonFile(
            Path.Combine(
                b.Environment.ContentRootPath,
                "settings/component-type-maps.json"),
            optional: false);
        
        AppMode mode = new() { IsWorkshop = b.Configuration.GetValue<bool>("WorkshopMode") };

        // Configure DI Services
        b.ConfigureServices(mode);
        
        // Initialisation before building the app
        // await b.Initialise();

        // Build the app
        var app = b.Build();
    
        // Initialisation before the app runs
        await app.Initialise(mode);

        // Configure the HTTP Request Pipeline
        app.UseWebPipeline(mode);

        // Run the app!
        await app.RunAsync();
    }
    
}
