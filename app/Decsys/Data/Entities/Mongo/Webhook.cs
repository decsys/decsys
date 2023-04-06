namespace Decsys.Data.Entities.Mongo;

public class Webhook
{
    public int SurveyId { get; set; }
    public string CallbackUrl { get; set; } = string.Empty;
    public string Secret { get; set; } = string.Empty;
    public bool VerifySsl { get; set; }
    public string EventTypeTrigger { get; set; } = string.Empty;

    // public ? TriggerParameters;
    // public ? TriggerFilters;


}
