namespace Decsys.Models.Webhooks;

public class PayloadModel
{
    public PayloadModel(ParticipantResultsSummary participantResultsSummary)
    {
        ParticipantResultsSummary = participantResultsSummary;
    }

    public DateTimeOffset Timestamp { get; set; }
    public string SourcePage { get; set; } = string.Empty;
    public string RequestedTargetPage { get; set; } = string.Empty;
    public string ResolvedTargetPage { get; set; } = string.Empty;
    public string NavigationStatus { get; set; } = string.Empty;
    public int ParticipantId { get; set; }
    public int SurveyId { get; set; }
    public int InstanceId { get; set; }

    public ParticipantResultsSummary ParticipantResultsSummary
    {
        get;
        set;
    } 

}
