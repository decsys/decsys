namespace Decsys.Models.Webhooks;

public class PayloadModel
{ 
    public PayloadModel(string surveyId, string participantId, BaseEventType eventType, object? payload)
    {
        SurveyId = surveyId;
        EventType = eventType;
        ParticipantId = participantId;
        Payload = payload;
    }

    public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;
    public string SurveyId { get; set; }
    public string ParticipantId { get; set; }
    public BaseEventType EventType { get; set; }
    public object? Payload { get; set; } 

}
