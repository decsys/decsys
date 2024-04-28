using System.CommandLine;
using System.CommandLine.IO;
using Decsys.Commands.Helpers;
using Decsys.Config;
using MongoDB.Driver;

namespace Decsys.Commands;

public class ListWebhooks : Command
{
    public ListWebhooks(string name)
        : base(name, "List all Webhooks configured for a given Survey.")
    {
        var optConnectionString = new Option<string?>(["--connection-string", "-c"],
            "Database Connection String if not specified in Configuration");
        Add(optConnectionString);

        var argSurveyId = new Argument<string>("survey-id",
            "The target Survey Id, either as a numeric Survey Id or a combined Friendly Id for Survey and Instance");
        Add(argSurveyId);

        this.SetHandler((
                logger, console, config,
                surveyId,
                overrideConnectionString) =>
            {
                var mongoClient = new MongoClient(overrideConnectionString ?? config.GetConnectionString("mongo"));
                
                console.Out.WriteLine(config.GetConnectionString("mongo"));

                this.ConfigureServices(s => s
                        .AddSingleton<ILoggerFactory>(_ => logger)
                        .AddSingleton<IConsole>(_ => console)
                        .AddSingleton<IConfiguration>(_ => config)
                        .AddMongoDb(mongoClient)
                        .AddMongoDbRepositories()
                        .Configure<HostedDbSettings>(config.GetSection("Hosted"))
                        .AddTransient<Runners.ListWebhooks>())
                    .GetRequiredService<Runners.ListWebhooks>().Run(surveyId);
            },
            Bind.FromServiceProvider<ILoggerFactory>(),
            Bind.FromServiceProvider<IConsole>(),
            Bind.FromServiceProvider<IConfiguration>(),
            argSurveyId,
            optConnectionString);
    }
}
