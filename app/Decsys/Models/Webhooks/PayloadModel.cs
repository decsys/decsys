namespace Decsys.Models.Webhooks;

public class PayloadModel
{ 
    public PayloadModel(int surveyId, int instanceId, string participantId, BaseEventType eventType, ParticipantResultsSummary participantResultsSummary)
    {
        SurveyId = surveyId;
        InstanceId = instanceId;
        EventType = eventType;
        ParticipantResultsSummary = participantResultsSummary;
        ParticipantId = participantId;
    }

    public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;
    public string ParticipantId { get; set; }
    public int SurveyId { get; set; }
    public int InstanceId { get; set; }
    public BaseEventType EventType { get; set; }
    public ParticipantResultsSummary ParticipantResultsSummary
    {
        get;
        set;
    } 

}
