using Decsys.Models.Webhooks;

namespace Decsys.Data.Entities.Mongo;

public class Webhook
{
    public int Id { get; set; }
    public int SurveyId { get; set; }
    public string CallbackUrl { get; set; } = string.Empty;
    public string? SecretHash { get; set; }
    public bool VerifySsl { get; set; }

    public List<TriggerCriteria> TriggerCriteria { get; set; } = new List<TriggerCriteria>();
}
