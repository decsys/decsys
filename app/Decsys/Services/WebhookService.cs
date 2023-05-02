using Decsys.Models.Webhooks;
using Decsys.Repositories.Contracts;

namespace Decsys.Services;

public class WebhookService
{
    private readonly IWebhookRepository _webhooks;

    public WebhookService(
        IWebhookRepository webhooks
    )
    {
        _webhooks = webhooks;
    }

    /// <summary>
    /// Creates a Webhook
    /// </summary>
    /// <param name="model">Webhook model to create</param>
    /// <returns>The created Webhook</returns>
    public int Create(WebhookModel model)
        => _webhooks.Create(model);
    
}
