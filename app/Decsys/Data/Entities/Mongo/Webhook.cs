using Decsys.Models.Webhooks;

namespace Decsys.Data.Entities.Mongo;

public class Webhook
{
    public string Id { get; set; } = string.Empty;
    public int SurveyId { get; set; }
    public string CallbackUrl { get; set; } = string.Empty;
    public string? Secret { get; set; }
    public bool VerifySsl { get; set; }

    public TriggerCriteria TriggerCriteria { get; set; } = new();
}
