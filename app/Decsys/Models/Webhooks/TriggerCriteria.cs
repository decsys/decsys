namespace Decsys.Models.Webhooks;

public class TriggerCriteria
{
    public bool HasCustomTriggers { get; set; }
    public EventTriggerFilters EventTypes = new();

}
