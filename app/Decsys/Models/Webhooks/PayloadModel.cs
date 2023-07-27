namespace Decsys.Models.Webhooks;

public class PayloadModel
{ 
    public PayloadModel(int surveyId, int instanceId, string participantId, BaseEventType eventType, object? payload)
    {
        SurveyId = surveyId;
        InstanceId = instanceId;
        EventType = eventType;
        ParticipantId = participantId;
        Payload = payload;
    }

    public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;
    public string ParticipantId { get; set; }
    public int SurveyId { get; set; }
    public int InstanceId { get; set; }
    public BaseEventType EventType { get; set; }
    public object? Payload { get; set; } 

}
