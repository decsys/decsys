using System.Security.Cryptography;
using System.Text;
using Decsys.Models.Webhooks;
using Decsys.Repositories.Contracts;
using Decsys.Utilities;
using Newtonsoft.Json;

namespace Decsys.Services;

public class WebhookService
{
    private readonly IWebhookRepository _webhooks;
    private readonly HttpClient _client;
    private readonly ILogger<WebhookService> _logger;

    public WebhookService(
        IWebhookRepository webhooks,
        IHttpClientFactory httpClientFactory,
        ILoggerFactory logger)
    {
        _webhooks = webhooks;
        _client = httpClientFactory.CreateClient();
        _logger = logger.CreateLogger<WebhookService>();
    }

    /// <summary>
    /// Creates a Webhook
    /// </summary>
    /// <param name="model">Webhook model to create</param>
    /// <returns>The created Webhook</returns>
    public string Create(WebhookModel model)
        => _webhooks.Create(model);

    public ViewWebhook Get(string webhookId)
        => _webhooks.Get(webhookId);

    public List<ViewWebhook> List(int surveyId)
    {
        var webhookModels = _webhooks.List(surveyId);

        var webhookViewModels = webhookModels.Select(w => new ViewWebhook
        {
            Id = w.Id,
            SurveyId = w.SurveyId,
            CallbackUrl = w.CallbackUrl,
            HasSecret = !string.IsNullOrEmpty(w.Secret),
            VerifySsl = w.VerifySsl,
            TriggerCriteria = w.TriggerCriteria
        }).ToList();

        return webhookViewModels;
    }


    /// <summary>
    /// Triggers webhooks from a given payload.
    /// </summary>
    /// <param name="payload">The payload to trigger and Post.</param>
    public async Task Trigger(PayloadModel payload, bool forceTrigger = false) 
    {
        var (surveyId, instanceId) = FriendlyIds.Decode(payload.SurveyId);

        var webhooks = _webhooks.List(surveyId);

        foreach (var webhook in webhooks)
        {
            if (forceTrigger || FilterCriteria(webhook, payload)) 
            {
                _logger.LogDebug("Criteria met or force trigger; triggering webhook {Webhook}...", webhook.Id);
                await SendWebhook(webhook, payload);
            }
            else
            {
                _logger.LogDebug("Criteria not met for webhook {Webhook}.", webhook.Id);
            }
        }
    }



    /// <summary>
    /// Filters webhooks based on matching criteria. Determines whether a webhook should be triggered by a given event.
    /// </summary>
    /// <param name="payload">The payload or event to evaluate.</param>
    /// <param name="webhook">The webhook to potentially be triggered.</param>
    /// <returns>True if the webhook should be triggered by the event, false otherwise.</returns>
    private bool FilterCriteria(WebhookModel webhook, PayloadModel payload)
    {
        // If the webhook does not have custom triggers, it can be triggered by any event.
        if (!webhook.TriggerCriteria.HasCustomTriggers)
            return true;

        // If the webhook does have custom triggers, the type of the event matters.
        switch (payload.EventType)
        {
            case PageNavigation pageNavigation:
                // If no 'PageNavigation' filters exist, the webhook can't be triggered
                if (webhook.TriggerCriteria.EventTypes.PageNavigation == null)
                {
                    return false;
                }
                // If the webhook has 'PageNavigation' checked but no specific filters, any 'PageNavigation' event triggers it.
                else if (webhook.TriggerCriteria.EventTypes.PageNavigation.Count == 0)
                {
                    return true;
                }
                // If the webhook has specific filters for 'PageNavigation' events, only those that match trigger it.
                else
                {
                    foreach (var navFilter in webhook.TriggerCriteria.EventTypes.PageNavigation)
                    {
                        _logger.LogDebug(
                            "Validating Page Navigation Trigger - Trigger Filter Source Page: {WebhookSourcePage} vs Event Source Page: {EventSourcePage}",
                            navFilter.SourcePage, pageNavigation.SourcePage);
                        
                        if (IsValidPageNavigationTrigger(navFilter, pageNavigation))
                            return true;
                    }
                }

                break;
        }

        // If the event type doesn't match any filters, the webhook is not triggered.
        return false;
    }

    /// <summary>
    /// Checks whether a given 'PageNavigation' event matches a given filter.
    /// </summary>
    /// <param name="webhookFilter">The filter to check against.</param>
    /// <param name="payloadNavigation">The 'PageNavigation' event to check.</param>
    /// <returns>True if the event matches the filter, false otherwise.</returns>
    private static bool IsValidPageNavigationTrigger(PageNavigationFilters webhookFilter,
        PageNavigation? payloadNavigation)
    {
        // If there is no 'PageNavigation' event, it cannot match any filters.
        if (payloadNavigation == null) return false;

        // The event matches the filter if their source pages are the same.
        return webhookFilter.SourcePage == payloadNavigation.SourcePage;
    }


    /// <summary>
    /// Posts webhook data to a given URL.
    /// </summary>
    /// <param name="payload">Payload to Post</param>
    /// <param name="webhook">An instance of WebhookModel containing the CallbackUrl and a Secret for HMACSHA256 hashing</param>
    private async Task SendWebhook(WebhookModel webhook, PayloadModel payload)
    {
        var json = JsonConvert.SerializeObject(payload);
        
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        if (webhook.Secret is not null)
        {
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(webhook.Secret));
            var signature = hmac.ComputeHash(Encoding.UTF8.GetBytes(json));
            content.Headers.Add("X-Decsys-Signature", Convert.ToBase64String(signature));
        }

        var response = await _client.PostAsync(webhook.CallbackUrl, content);
        
        _logger.LogDebug("Webhook Response Status: {ResponseStatus}", response.StatusCode);
    }

    public ViewWebhook Edit(string webhookId, WebhookModel model)
    {
        var existingWebhook = _webhooks.Get(webhookId);
        if (existingWebhook == null)
            throw new KeyNotFoundException($"Webhook with ID {webhookId} not found.");

        if (existingWebhook.SurveyId != model.SurveyId)
            throw new KeyNotFoundException($"No webhook found with ID {webhookId} matching the provided survey ID.");

        return _webhooks.Edit(webhookId, model);
    }

    /// <summary>
    /// Duplicates a webhook
    /// </summary>
    /// <param name="originalWebhook">The ID of the webhook to duplicate.</param>
    /// <param name="surveyId">The ID of the survey which is getting duplicated.</param>
    /// <returns>The duplicated Webhook</returns>
    public WebhookModel Duplicate(ViewWebhook originalWebhook, int surveyId)
    {
        var newWebhook = new WebhookModel
        {
            SurveyId = surveyId,
            CallbackUrl = originalWebhook.CallbackUrl,
            VerifySsl = originalWebhook.VerifySsl,
            TriggerCriteria = originalWebhook.TriggerCriteria,
            Secret = string.Empty,
        };

        _webhooks.Create(newWebhook);

        return newWebhook;
    }

    /// <summary>
    /// Deletes a webhook by its ID.
    /// </summary>
    /// <param name="webhookId">The ID of the webhook to delete.</param>
    public void Delete(string webhookId)
    {
        _webhooks.Delete(webhookId);
    }

    public PayloadModel? PreviewTrigger(PayloadModel payload)
    {
        var (surveyId, instanceId) = FriendlyIds.Decode(payload.SurveyId);
        var webhooks = _webhooks.List(surveyId);

        foreach (var webhook in webhooks)
        {
            if (FilterCriteria(webhook, payload))
            {
                return payload;
            }
        }

        return null;
    }
}
