using System.CommandLine;
using System.CommandLine.IO;
using Decsys.Commands.Helpers;
using Decsys.Config;
using Decsys.Services;
using MongoDB.Driver;

namespace Decsys.Commands;

public class TriggerWebhooks : Command
{
    public TriggerWebhooks(string name)
        : base(name, "Trigger all Webhooks for a given Survey Instance Participant event where criteria is met")
    {
        var optConnectionString = new Option<string?>(["--connection-string", "-c"],
            "Database Connection String if not specified in Configuration.");
        Add(optConnectionString);

        var argFriendlyId = new Argument<string>("friendly-id",
            "The DECSYS Combined Friendly Id for the target Survey Instance.");
        Add(argFriendlyId);

        var argParticipantId = new Argument<string>("participant-id",
            "The Id of the Participant in the target Survey Instance.");
        Add(argParticipantId);

        var argEventSource = new Argument<string>("event-id",
            "The Event Source value for which to trigger webhooks. For PAGE_NAVIGATION this is the id of the page the Participant is leaving. The last logged event with this source will be used.");
        Add(argEventSource);

        this.SetHandler(async (
                logger, console, config,
                friendlyId,
                participantId,
                eventSource,
                overrideConnectionString) =>
            {
                var mongoClient = new MongoClient(overrideConnectionString ?? config.GetConnectionString("mongo"));

                console.Out.WriteLine(config.GetConnectionString("mongo"));

                await this.ConfigureServices(s => s
                        .AddSingleton<ILoggerFactory>(_ => logger)
                        .AddSingleton<IConsole>(_ => console)
                        .AddSingleton<IConfiguration>(_ => config)
                        .AddHttpClient()
                        .AddMongoDb(mongoClient)
                        .AddMongoDbRepositories()
                        .Configure<HostedDbSettings>(config.GetSection("Hosted"))
                        .AddAutoMapper(typeof(Program))
                        .AddTransient<ParticipantEventService>()
                        .AddTransient<WebhookService>()
                        .AddTransient<Runners.TriggerWebhooks>())
                    .GetRequiredService<Runners.TriggerWebhooks>().Run(friendlyId, participantId, eventSource);
            },
            Bind.FromServiceProvider<ILoggerFactory>(),
            Bind.FromServiceProvider<IConsole>(),
            Bind.FromServiceProvider<IConfiguration>(),
            argFriendlyId,
            argParticipantId,
            argEventSource,
            optConnectionString);
    }
}
