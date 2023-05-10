namespace Decsys.Models.Webhooks;

public class PayloadModel
{
    
    public DateTimeOffset Timestamp { get; set; }
    public string ParticipantId { get; set; } = string.Empty;
    public int SurveyId { get; set; }
    public int InstanceId { get; set; }
    
    public BaseEventType? EventType { get; set; }
    public ParticipantResultsSummary? ParticipantResultsSummary
    {
        get;
        set;
    } 

}
