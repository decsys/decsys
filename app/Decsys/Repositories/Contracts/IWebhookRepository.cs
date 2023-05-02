using Decsys.Models.Webhooks;

namespace Decsys.Repositories.Contracts;

public interface IWebhookRepository
{
    /// <summary>
    /// Create a new webhook.
    /// </summary>
    /// <param name="webhook"></param>
    /// <returns>The created Webhook Id</returns>
    int Create(WebhookModel webhook);
}
