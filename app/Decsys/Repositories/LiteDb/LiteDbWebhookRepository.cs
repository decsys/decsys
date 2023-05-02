using Decsys.Models.Webhooks;
using Decsys.Repositories.Contracts;

namespace Decsys.Repositories.LiteDb;

public class LiteDbWebhookRepository : IWebhookRepository
{
    public int Create(WebhookModel webhook)
    {
        // Webhooks are not necessary for an instance in workshop mode.
        throw new NotImplementedException();
    }
}
