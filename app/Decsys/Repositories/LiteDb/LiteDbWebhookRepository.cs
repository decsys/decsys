using Decsys.Models.Webhooks;
using Decsys.Repositories.Contracts;

namespace Decsys.Repositories.LiteDb;

/// <summary>
/// Webhooks are not necessary for an instance in workshop mode.
/// </summary>
public class LiteDbWebhookRepository : IWebhookRepository
{
    public string Create(WebhookModel webhook)
    {
        throw new NotImplementedException();
    }

    public ViewWebhook Get(string webhookId)
    {
        throw new NotImplementedException();
    }
    
    public List<WebhookModel> List(int surveyId)
    {
        throw new NotImplementedException();
    }
    
    public ViewWebhook Edit(string webhookId, WebhookModel model)
    {
        throw new NotImplementedException();
    }
    
    public void Delete(string webhookId)
    {
        throw new NotImplementedException();
    }
}
