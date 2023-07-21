using Decsys.Models.Webhooks;
using MongoDB.Bson;

namespace Decsys.Data.Entities.Mongo;

public class Webhook
{
    public ObjectId Id { get; set; }
    public int SurveyId { get; set; }
    public string CallbackUrl { get; set; } = string.Empty;
    public string? Secret { get; set; }
    public bool VerifySsl { get; set; }

    public TriggerCriteria TriggerCriteria { get; set; } = new();
}
