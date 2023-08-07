using System.Security.Cryptography;
using System.Text;
using Decsys.Models.Webhooks;
using Decsys.Repositories.Contracts;
using Newtonsoft.Json;

namespace Decsys.Services;

public class WebhookService
{
    private readonly IWebhookRepository _webhooks;
    private readonly HttpClient _client;

    public WebhookService(
        IWebhookRepository webhooks,
        IHttpClientFactory httpClientFactory
    )
    {
        _webhooks = webhooks;
        _client = httpClientFactory.CreateClient();
    }

    /// <summary>
    /// Creates a Webhook
    /// </summary>
    /// <param name="model">Webhook model to create</param>
    /// <returns>The created Webhook</returns>
    public string Create(WebhookModel model)
        => _webhooks.Create(model);
    
    
    public List<WebhookModel> List(int surveyId)
        => _webhooks.List(surveyId);
    
    /// <summary>
    /// Triggers webhooks from a given payload.
    /// </summary>
    /// <param name="payload">The payload to trigger and Post.</param>
    public async Task Trigger(PayloadModel payload)
    {
        var webhooks = _webhooks.List(payload.SurveyId);
        
        foreach (var webhook in webhooks)
        {
            if (FilterCriteria(webhook, payload))
            {
                await SendWebhook(webhook, payload);
            }
        }
    }

    /// <summary>
    /// Filters webhooks based on matching criteria. Determines whether a webhook should be triggered by a given event.
    /// </summary>
    /// <param name="payload">The payload or event to evaluate.</param>
    /// <param name="webhook">The webhook to potentially be triggered.</param>
    /// <returns>True if the webhook should be triggered by the event, false otherwise.</returns>
    private static bool FilterCriteria(WebhookModel webhook, PayloadModel payload)
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
    private static bool IsValidPageNavigationTrigger(PageNavigationFilters webhookFilter, PageNavigation? payloadNavigation)
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
             content.Headers.Add("X-Decsys-Signature",
                 Encoding.ASCII.GetString(
                     hmac.ComputeHash(
                         Encoding.UTF8.GetBytes(json))));
         }
         await _client.PostAsync(webhook.CallbackUrl, content);
    }
}
