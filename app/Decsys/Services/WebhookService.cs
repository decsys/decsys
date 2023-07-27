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
    /// Filters the webhooks based on matching criteria.
    /// Currently focussed on matching page numbers on page navigation.
    /// </summary>
    /// <param name="payload">Payload to check</param>
    /// <param name="webhook">Webhook to match against.</param>
    /// <returns>True if filter matches</returns>
    private static bool FilterCriteria(WebhookModel webhook, PayloadModel payload)
    {
        // check 1: if they are the same event types
        var result = payload.EventType is PageNavigation && 
                     webhook.TriggerCriteria.EventTypes.PageNavigation.Any();

        if (result)
        {
            // check 2: type specific validation criteria
            // add further criteria for further types
            foreach (var navFilter in webhook.TriggerCriteria.EventTypes.PageNavigation)
            {
                result = CheckIsValid(navFilter, payload.EventType as PageNavigation);
                if (result) return true;
            }
        }
        return false;
    }

    private static bool IsValidPageNavigationTrigger(PageNavigationFilters webhookFilter, PageNavigation? payloadNavigation)
    {
        if (payloadNavigation == null) return false;

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
                Encoding.UTF8.GetString(
                    hmac.ComputeHash(
                        Encoding.UTF8.GetBytes(json))));
         }
         await _client.PostAsync(webhook.CallbackUrl, content);
    }
}
