namespace Decsys.Models.Webhooks;

public class ViewWebhook
{
    public string Id { get; set; }  = string.Empty;
    public int SurveyId { get; set; }
    public string CallbackUrl { get; set; } = string.Empty;
    public bool HasSecret { get; set; }
    public bool VerifySsl { get; set; }
    /// <summary>
    /// The trigger criteria to test against.
    /// </summary>
    public TriggerCriteria TriggerCriteria { get; set; } = new();

}
