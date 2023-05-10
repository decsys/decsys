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
    /// Triggers webhooks
    /// Triggers 
    /// </summary>
    /// <param name="payload">The payload to trigger and Post.</param>
    public async Task Trigger(PayloadModel payload)
    {
        var webhooks = _webhooks.GetWebhooksBySurvey(payload.SurveyId);
        
        foreach (var webhook in webhooks)
        {
            if (await Filter(payload, webhook))
            {
                await SendWebhook(payload, webhook.CallbackUrl);
            }
        }
    }

    /// <summary>
    /// Filters the webhooks
    /// </summary>
    /// <param name="payload"></param>
    /// <param name="webhook"></param>
    /// <returns>True if filter matches</returns>
    private static Task<bool> Filter(PayloadModel payload, WebhookModel webhook)
    {
        foreach (var eventType in webhook.TriggerCriteria.SelectMany(filter => filter.EventTypes))
        {
            switch (payload.EventType)
            {
                case PageNavigation pageNavigationEvent:
                    if (eventType.GetType() == typeof(PageNavigation))
                    {
                        var pageEvent = (PageNavigation) eventType;
                        if (pageNavigationEvent.SourcePage == pageEvent.SourcePage)
                        {
                            return Task.FromResult(true);
                        }
                    }
                    break;
                
                default:
                    throw new NotSupportedException($"Event type is not supported.");
                    break;
            }
        }

        return Task.FromResult(false);
    }

    /// <summary>
    /// Posts webhook data
    /// </summary>
    /// <param name="payload">Payload to Post</param>
    /// <param name="webhook">Webhook to activate</param>
    private async Task SendWebhook(PayloadModel payload, string callbackUrl)
    {
        var json = JsonConvert.SerializeObject(payload);
        
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        var resp = await _client.PostAsync(callbackUrl, content);
        resp.EnsureSuccessStatusCode();
    }

}
