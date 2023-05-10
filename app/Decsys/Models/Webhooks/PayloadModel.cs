namespace Decsys.Models.Webhooks;

public class PayloadModel
{ 
    public PayloadModel(int surveyId, int instanceId, string participantId, BaseEventType eventType, ParticipantResultsSummary participantResultsSummary)
    {
        Timestamp = DateTimeOffset.UtcNow;
        SurveyId = surveyId;
        InstanceId = instanceId;
        EventType = eventType;
        ParticipantResultsSummary = participantResultsSummary;
        ParticipantId = participantId;
    }
    public DateTimeOffset Timestamp { get; }
    public string ParticipantId { get; }
    public int SurveyId { get; }
    public int InstanceId { get; }
    public BaseEventType EventType { get; }
    public ParticipantResultsSummary ParticipantResultsSummary
    {
        get;
    } 

}
