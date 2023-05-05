namespace Decsys.Models.Webhooks;

public class PayloadModel
{
    
    public DateTimeOffset Timestamp { get; set; }
    public int SourcePage { get; set; }
    public int RequestedTargetPage { get; set; }
    public int ResolvedTargetPage { get; set; }
    public string NavigationStatus { get; set; } = string.Empty;
    public string ParticipantId { get; set; } = string.Empty;
    public int SurveyId { get; set; }
    public int InstanceId { get; set; }

    public ParticipantResultsSummary? ParticipantResultsSummary
    {
        get;
        set;
    } 

}
