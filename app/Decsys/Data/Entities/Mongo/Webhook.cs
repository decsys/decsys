namespace Decsys.Data.Entities.Mongo;

public class Webhook
{
    public int SurveyId { get; set; }
    public string CallbackUrl { get; set; } = string.Empty;
    public string Secret { get; set; } = string.Empty;
    public bool VerifySsl { get; set; }
    public EventType EventType { get; set; }
    public Dictionary<string, string> TriggerParameters { get; set; } = new Dictionary<string, string>();
    public List<TriggerFilter> TriggerFilters { get; set; } = new List<TriggerFilter>();
}

public class TriggerFilter
{
    public string Name { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public FilterOperator Operator { get; set; }
}

public enum FilterOperator
{
    EQUALS,
    NOT_EQUALS,
}

public enum EventType
{
    PAGE_NAVIGATION,
    SURVEY_COMPLETE
}

