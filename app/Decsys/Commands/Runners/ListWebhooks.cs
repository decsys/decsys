using System.CommandLine;
using System.CommandLine.IO;
using System.Text.Json;
using IdentityModel;
using IdentityServer4.Models;
using ConsoleTableExt;
using Decsys.Repositories.Contracts;
using Decsys.Utilities;

namespace Decsys.Commands.Runners;

public class ListWebhooks
{
    private readonly IConsole _console;
    private readonly IWebhookRepository _webhooks;
    private readonly ILogger<ListWebhooks> _logger;

    public ListWebhooks(
        ILoggerFactory logger, IConsole console, IWebhookRepository webhooks)
    {
        _console = console;
        _webhooks = webhooks;
        _logger = logger.CreateLogger<ListWebhooks>();
    }

    public void Run(string inputId)
    {
        if (!int.TryParse(inputId, out var surveyId))
        {
            // they didn't pass an integer input; decode it from a friendly Id instead
            (surveyId, _) = FriendlyIds.Decode(inputId);
        }

        _console.Out.WriteLine(
            $"Webhooks configured for Survey: {surveyId}{(inputId != surveyId.ToString() ? $" ({inputId})" : "")}");

        var hooks = _webhooks.List(surveyId);

        if (hooks.Count != 0)
        {
            foreach (var hook in hooks)
            {
                var outputRows = new List<List<object>>
                {
                    new() { "Id", hook.Id },
                    new() { "Callback URL", hook.CallbackUrl },
                    new()
                    {
                        // TODO this table will need improving when other filter types are added
                        "PAGE_NAVIGATION Trigger Filters",
                        JsonSerializer.Serialize(hook.TriggerCriteria.EventTypes.PageNavigation)
                    },
                };

                _console.Out.Write(ConsoleTableBuilder
                    .From(outputRows)
                    .WithCharMapDefinition(CharMapDefinition.FramePipDefinition)
                    .Export()
                    .ToString());
            }
        }
        else
        {
            var outputRows = new List<string>
            {
                "\u26a0\ufe0f No webhooks configured!"
            };

            _console.Out.Write(ConsoleTableBuilder
                .From(outputRows)
                .WithCharMapDefinition(CharMapDefinition.FramePipDefinition)
                .Export()
                .ToString());
        }
    }
}
