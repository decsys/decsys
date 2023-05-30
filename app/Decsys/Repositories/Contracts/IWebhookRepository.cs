using Decsys.Models.Webhooks;

namespace Decsys.Repositories.Contracts;

public interface IWebhookRepository
{
    /// <summary>
    /// Create a new webhook.
    /// </summary>
    /// <param name="webhook">The webhook model to create.</param>
    /// <returns>The created Webhook Id</returns>
    int Create(WebhookModel webhook);

    /// <summary>
    /// List all webhooks for a given survey Id.
    /// </summary>
    /// <param name="surveyId">The survey id to filter by</param>
    /// <returns>A list of Webhook models.</returns>
    List<WebhookModel> List(int surveyId);
}
