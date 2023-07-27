namespace Decsys.Models.Webhooks;

public class PayloadModel
{ 
    public PayloadModel(int surveyId, int instanceId, string participantId, BaseEventType eventType, PageResponseSummary? pageResponseSummary)
    {
        SurveyId = surveyId;
        InstanceId = instanceId;
        EventType = eventType;
        PageResponseSummary = pageResponseSummary;
        ParticipantId = participantId;
    }

    public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;
    public string ParticipantId { get; set; }
    public int SurveyId { get; set; }
    public int InstanceId { get; set; }
    public BaseEventType EventType { get; set; }
    public object? Payload { get; set; } 

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
