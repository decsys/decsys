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
    
    public ObjectId Create(WebhookModel webhook)
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

        return entity.Id;
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
                    TriggerCriteria = x.TriggerCriteria
                })).ToList();
    
}
