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
}
