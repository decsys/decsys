using Decsys.Config;
using Decsys.Constants;
using Decsys.Data.Entities.Mongo;
using Decsys.Models.Webhooks;
using Decsys.Repositories.Contracts;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Decsys.Repositories.Mongo;

public class WebhookRepository : IWebhookRepository
{
    private readonly IMongoCollection<Webhook> _webhooks;

    public WebhookRepository(
        IOptions<HostedDbSettings> config,
        IMongoClient mongo
    )
    {
        var db = mongo.GetDatabase(config.Value.DatabaseName);
        _webhooks = db.GetCollection<Webhook>(Collections.Webhooks);
    }
    
    public string Create(WebhookModel webhook)
    {
        var entity = new Webhook
        {
            SurveyId = webhook.SurveyId,
            CallbackUrl = webhook.CallbackUrl,
            Secret = webhook.Secret,
            VerifySsl = webhook.VerifySsl,
            TriggerCriteria = webhook.TriggerCriteria
        };
        
        _webhooks.InsertOne(entity);

        return entity.Id.ToString();
    }
    
    public ViewWebhook Get(string webhookId)
    {
        var objectId = new ObjectId(webhookId);
        var webhook = _webhooks.Find(x => x.Id == objectId).FirstOrDefault();

        return new ViewWebhook
        {
            Id = webhook.Id.ToString(),
            SurveyId = webhook.SurveyId,
            CallbackUrl = webhook.CallbackUrl,
            HasSecret = !string.IsNullOrEmpty(webhook.Secret),
            VerifySsl = webhook.VerifySsl,
            TriggerCriteria = webhook.TriggerCriteria
        };
    }
    
    public List<WebhookModel> List(int surveyId)
        => _webhooks.Find(x => x.SurveyId == surveyId)
            .Project(Builders<Webhook>.Projection.Expression(
                x => new WebhookModel
                {
                    SurveyId = x.SurveyId,
                    CallbackUrl = x.CallbackUrl,
                    Secret = x.Secret,
                    VerifySsl = x.VerifySsl,
                    TriggerCriteria = x.TriggerCriteria,
                    Id = x.Id.ToString()
                })).ToList();

    public ViewWebhook Edit(string webhookId, WebhookModel model)
    {
        var objectId = new ObjectId(webhookId);
        var webhook = _webhooks.Find(x => x.Id == objectId).FirstOrDefault();
        
        webhook.CallbackUrl = model.CallbackUrl;
        webhook.VerifySsl = model.VerifySsl;
        webhook.TriggerCriteria = model.TriggerCriteria;
        if (model.Secret != null)
        {
            webhook.Secret = model.Secret;
        }
        
        _webhooks.ReplaceOne(x => x.Id == objectId, webhook);
        
        return new ViewWebhook
        {
            Id = webhook.Id.ToString(),
            SurveyId = webhook.SurveyId,
            CallbackUrl = webhook.CallbackUrl,
            HasSecret = !string.IsNullOrEmpty(webhook.Secret),
            VerifySsl = webhook.VerifySsl,
            TriggerCriteria = webhook.TriggerCriteria
        };
    }

    public void Delete(string webhookId)
    {
        var objectId = new ObjectId(webhookId);
        _webhooks.DeleteOne(x => x.Id == objectId);
    }
    
}
