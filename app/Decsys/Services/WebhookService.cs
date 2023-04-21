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
    /// <param name="model"></param>
    /// <returns></returns>
    public WebhookModel Create(WebhookModel model)
        => _webhooks.Create(model);
    
}
