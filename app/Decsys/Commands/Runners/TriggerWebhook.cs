using System.CommandLine;
using System.CommandLine.IO;
using System.Text.Json;
using IdentityModel;
using IdentityServer4.Models;
using ConsoleTableExt;
using Decsys.Constants;
using Decsys.Models.EventPayloads;
using Decsys.Models.Webhooks;
using Decsys.Repositories.Contracts;
using Decsys.Services;
using Decsys.Utilities;

namespace Decsys.Commands.Runners;

public class TriggerWebhooks
{
    private readonly IConsole _console;
    private readonly WebhookService _webhooks;
    private readonly ParticipantEventService _events;
    private readonly ILogger<TriggerWebhooks> _logger;

    public TriggerWebhooks(
        ILoggerFactory logger, IConsole console, WebhookService webhooks, ParticipantEventService events)
    {
        _console = console;
        _webhooks = webhooks;
        _events = events;
        _logger = logger.CreateLogger<TriggerWebhooks>();
    }

    public async Task Run(string friendlyId,
        string participantId,
        string eventSource)
    {
        var (surveyId, instanceId) = FriendlyIds.Decode(friendlyId);

        // get the actual payload and event type details // TODO: this will be different for different event types in future
        var payload = _events.ResultsSummary(instanceId, participantId);

        var triggeringEvent = _events.Last(instanceId, participantId, eventSource, EventTypes.PAGE_NAVIGATION)
                              ?? throw new KeyNotFoundException(
                                  "Could not find any events matching the provided Source for this Participant.");
        var eventPayload = triggeringEvent.Payload.ToObject<PageNavigationEventPayload>()
                           ?? throw new InvalidOperationException("The triggering event has an invalid payload.");

        // Get Participant's Page Order so we can convert page id's to order numbers
        var pageOrderEvent = _events.Last(
            instanceId,
            participantId,
            surveyId.ToString(),
            EventTypes.PAGE_RANDOMIZE);
        var pageOrder = pageOrderEvent?.Payload.ToObject<PageRandomizeEventPayload>()?.Order
                        ?? throw new InvalidOperationException(
                            "Participant Page Randomize Event contains invalid payload.");

        var sourcePage = pageOrder.IndexOf(triggeringEvent.Source) + 1;
        var resolvedPage = pageOrder.IndexOf(eventPayload.TargetPageId ?? "") + 1;

        var eventType = new PageNavigation
        {
            ResolvedPage = resolvedPage,
            SourcePage = sourcePage
        };

        await _webhooks.Trigger(new PayloadModel(friendlyId, participantId, eventType, payload));
    }
}
