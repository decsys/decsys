namespace Decsys.Models.Webhooks;

public class PayloadModel
{ 
    public PayloadModel(int surveyId, int instanceId, string participantId, PageResponseSummary? pageResponseSummary)
    {
        SurveyId = surveyId;
        InstanceId = instanceId;
        PageResponseSummary = pageResponseSummary;
        ParticipantId = participantId;
    }

    public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;
    public string ParticipantId { get; set; }
    public int SurveyId { get; set; }
    public int InstanceId { get; set; }
    public PageResponseSummary? PageResponseSummary { get; set; } 

}
