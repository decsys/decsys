using Decsys.Models.Webhooks;

namespace Decsys.Repositories.Contracts;

public interface IWebhookRepository
{
    // Create a new webhook.
    WebhookModel Create(WebhookModel webhook);
}
