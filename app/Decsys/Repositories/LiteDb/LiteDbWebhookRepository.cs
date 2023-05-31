using Decsys.Data.Entities.Mongo;
using Decsys.Models.Webhooks;
using Decsys.Repositories.Contracts;

namespace Decsys.Repositories.LiteDb;

/// <summary>
/// Webhooks are not necessary for an instance in workshop mode.
/// </summary>
public class LiteDbWebhookRepository : IWebhookRepository
{
    public int Create(WebhookModel webhook)
    {
        throw new NotImplementedException();
    }

    public List<WebhookModel> List(int surveyId)
    {
        throw new NotImplementedException();
    }
}
