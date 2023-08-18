using Decsys.Models.Webhooks;

namespace Decsys.Repositories.Contracts;

public interface IWebhookRepository
{
    /// <summary>
    /// Create a new webhook.
    /// </summary>
    /// <param name="webhook">The webhook model to create.</param>
    /// <returns>The created Webhook Id</returns>
    string Create(WebhookModel webhook);

    /// <summary>
    /// Gets a webhook.
    /// </summary>
    /// <param name="webhookId">The webhook Id to get.</param>
    /// <returns>A single Webhook</returns>
    ViewWebhook Get(string webhookId);

    /// <summary>
    /// List all webhooks for a given survey Id.
    /// </summary>
    /// <param name="surveyId">The survey id to filter by</param>
    /// <returns>A list of Webhook models.</returns>
    List<WebhookModel> List(int surveyId);
    
    /// <summary>
    /// Delete a webhook by its Id.
    /// </summary>
    /// <param name="webhookId">The id of the webhook to delete.</param>
    void Delete(string webhookId);


    ViewWebhook Edit(string webhookId, WebhookModel model);
}
