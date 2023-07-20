namespace Decsys.Models.Webhooks;

public class WebhookModel
{
    public int SurveyId { get; set; }
    public string CallbackUrl { get; set; } = string.Empty;
    public string? Secret { get; set; }
    public bool VerifySsl { get; set; }
    
    /// <summary>
    /// The trigger criteria to test against.
    /// </summary>
    public List<TriggerCriteriaModel> TriggerCriteria { get; set; } = new List<TriggerCriteriaModel>();
}
