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
    public TriggerCriteria TriggerCriteria { get; set; } = new();

}

/// <summary>
/// Base model for Event Types, can be extended to add events to trigger on.
/// </summary>
public class BaseEventType
{
    public string Name { get; set; } = string.Empty;
}
public class PageNavigation : BaseEventType
{
    /// <summary>
    /// The page the user is leaving.
    /// </summary>
    public int SourcePage { get; set; }

    /// <summary>
    /// The requested page of the user.
    /// </summary>
    public int TargetPage { get; set; }

    /// <summary>
    /// The actual page the user is navigated to.
    /// </summary>
    public int ResolvedPage { get; set; }

    /// <summary>
    /// Whether the navigation was successful.
    /// </summary>
    public bool ResolvedSuccess { get; set; }
}
