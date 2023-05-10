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
    /// Triggers every webhook for a survey where the page number matches.
    /// </summary>
    /// <param name="payload"></param>
    public async Task Trigger(PayloadModel payload)
    {
        // TODO: Maybe this should be the instance of the survey...?
        var webhooks = _webhooks.GetWebhooksBySurvey(payload.SurveyId);
        
        foreach (var webhook in webhooks)
        {
            foreach (var filter in webhook.TriggerFilters)
            {
                // If pages match.
                // TODO: Can simplify the source page 
                if (filter.Name == "SourcePage" && filter.Value == payload.SourcePage.ToString())
                {
                    // Post data
                    await SendWebhook(payload, webhook);
                }
            }
        }
    }

    /// <summary>
    /// Posts webhook data
    /// </summary>
    /// <param name="payload"></param>
    /// <param name="webhook"></param>
    private async Task SendWebhook(PayloadModel payload, WebhookModel webhook)
    {
        var resultsJson = JsonConvert.SerializeObject(payload.ParticipantResultsSummary);
    
        // TODO: Note this is the redcap POST format.
        var parameters = new Dictionary<string, string>()
        {
            { "token", webhook.Secret }, 
            { "content", "record" },
            { "format", "json" },
            { "type", "flat" },
            { "overwriteBehavior", "normal" },
            { "forceAutoNumber", "false" },
            { "data", resultsJson },
            { "returnContent", "ids" },
            { "returnFormat", "json" }
        };
    
        var content = new FormUrlEncodedContent(parameters);
        var resp = await _client.PostAsync(webhook.CallbackUrl, content);
        resp.EnsureSuccessStatusCode();
    }

}
