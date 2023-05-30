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
    public int Create(WebhookModel model)
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
            if (await FilterCriteria(webhook, payload))
            {
                await SendWebhook(payload, webhook.CallbackUrl);
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
    private static Task<bool> FilterCriteria(WebhookModel webhook, PayloadModel payload)
    {
        foreach (var eventType in webhook.TriggerCriteria.SelectMany(filter => filter.EventTypes))
        {
            // check 1: if they are the same event types
            var result = eventType.GetType() == payload.EventType.GetType();

            if(result)
                // check 2 is type specific validation criteria
                // add further criteria for further types
            
                result = eventType switch {
                    PageNavigation tt => CheckIsValid(tt, payload.EventType as PageNavigation),
                    _ => false
                };

            return Task.FromResult(result);
        }
        
        return Task.FromResult(false);
    }
    
    private static bool CheckIsValid(PageNavigation pageNavigation, PageNavigation? payload)
    {
        if (payload == null) return false;

        return pageNavigation.SourcePage == payload.SourcePage;
    }

    /// <summary>
    /// Posts webhook data to a given URL.
    /// </summary>
    /// <param name="payload">Payload to Post</param>
    /// <param name="callbackUrl">Callback url to post to</param>
    private async Task SendWebhook(PayloadModel payload, string callbackUrl)
    {
        var json = JsonConvert.SerializeObject(payload);
        
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        await _client.PostAsync(callbackUrl, content);
    }

}
