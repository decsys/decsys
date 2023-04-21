using Decsys.Models.Webhooks;

namespace Decsys.Repositories.Contracts;

public interface IWebhookRepository
{
    /// <summary>
    /// Create a new webhook.
    /// </summary>
    /// <param name="webhook"></param>
    /// <returns></returns>
    WebhookModel Create(WebhookModel webhook);
}
